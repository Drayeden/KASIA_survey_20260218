/**
 * Google Apps Script for Survey App
 * 
 * 1. Open Google Sheets
 * 2. Extensions > Apps Script
 * 3. Paste this code
 * 4. Save and Deploy > New Deployment
 * 5. Select type: "Web App"
 * 6. Description: "Survey API"
 * 7. Execute as: "Me"
 * 8. Who has access: "Anyone" (Important!)
 * 9. Click "Deploy" and copy the "Web App URL"
 * 10. Paste the URL into app.js (GOOGLE_SCRIPT_URL constant)
 */

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        const nextRow = sheet.getLastRow() + 1;

        // Parse data
        const rawData = e.postData.contents;
        const data = JSON.parse(rawData);
        const responses = data.responses;
        const submittedAt = data.submittedAt;

        // Prepare row data
        const newRow = [];

        // First column: Timestamp
        newRow.push(submittedAt);

        // Map responses to headers (skip 1st column which is timestamp)
        // If headers don't exist yet, we might want to auto-create them, 
        // but for stability, we assume headers roughly match question IDs or we just dump JSON.
        // simpler approach for now:
        // If you want robust mapping, you need fixed headers. 
        // For this generic script, let's auto-append headers if empty, 
        // or just append key-value pairs if that's easier.

        // Better approach for this specific survey:
        // We iterate through known keys if possible, or we just trust the order?
        // "Trusting order" is dangerous.
        // Let's rely on headers in the sheet.

        if (headers.length <= 1) {
            // Setup headers if sheet is empty (only has default or no headers)
            // This is a one-time setup helper
            const keys = Object.keys(responses).sort();
            // Add keys to header
            sheet.getRange(1, 2, 1, keys.length).setValues([keys]);
            // re-read headers
            // actually, let's just do it dynamically for the row
        }

        // Re-read headers to be safe or just iterate existing headers
        const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];

        // If we have headers, try to map data to them
        if (currentHeaders.length > 1) {
            for (let i = 1; i < currentHeaders.length; i++) {
                const key = currentHeaders[i];
                let val = responses[key];

                // Handle arrays (multiple choice) and objects
                if (Array.isArray(val)) {
                    val = val.join(', ');
                } else if (typeof val === 'object' && val !== null) {
                    val = JSON.stringify(val);
                }

                newRow[i] = val || ''; // maintain index
            }
        } else {
            // Fallback: just dump values
            Object.keys(responses).forEach(key => {
                let val = responses[key];
                if (Array.isArray(val)) val = val.join(', ');
                newRow.push(`${key}: ${val}`);
            });
        }

        // Append row
        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

        return ContentService
            .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}
