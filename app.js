// ========================================
// 2026 AI Survey - Application Logic
// ========================================

// ========================================
// Google Sheets 설정
// ========================================
// 아래 URL을 Google Apps Script 웹 앱 URL로 교체하세요
const GOOGLE_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';

// Survey Data
const surveyData = {
  parts: [
    {
      id: 'part1',
      title: 'Part 1. 응답자 및 조직 기본 정보',
      sections: [
        {
          title: '1.1 조직 정보',
          questions: [
            {
              id: 'Q1', type: 'single', required: true, text: '귀 조직의 유형은 무엇입니까?',
              options: ['대기업', '중견기업', '중소기업', '공공부문 (정부, 공기업, 준정부기관, 기타 공공기관)', '대학교/대학원', '연구기관/연구소', '협회/단체', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q2', type: 'single', required: true, text: '귀 조직의 업종/분야는 무엇입니까?',
              options: ['제조업', '정보통신업 (IT/소프트웨어)', '금융/보험업', '도소매업', '건설업', '운수/물류업', '전문/과학/기술 서비스업', '교육 서비스업', '보건/의료업', '공공행정', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q3', type: 'single', required: true, text: '귀 조직의 상시 근로자 수(또는 구성원 수)는 몇 명입니까?',
              options: ['50명 미만', '50명 ~ 99명', '100명 ~ 299명', '300명 ~ 999명', '1,000명 ~ 4,999명', '5,000명 이상']
            }
          ]
        },
        {
          title: '1.2 응답자 정보',
          questions: [
            {
              id: 'Q4', type: 'single', required: true, text: '귀하의 직위/직급은 무엇입니까?',
              options: ['대표이사/CEO/기관장', '임원급 (C-Level, 본부장, 이사, 실장 등)', '팀장/부장급', '과장/차장급', '대리/사원/주임급', '교수/연구원', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q5', type: 'single', required: true, text: '귀하의 소속 부서/분야는 어디입니까?',
              options: ['경영기획/전략', '인사/HRD/교육', 'IT/정보시스템/디지털전환', '연구개발(R&D)', '마케팅/영업', '생산/제조/운영', '재무/회계', { label: '기타', hasInput: true }]
            }
          ]
        }
      ]
    },
    {
      id: 'part2',
      title: 'Part 2. AI 도입 현황',
      sections: [
        {
          title: '2.1 AI 도입 여부',
          questions: [
            {
              id: 'Q6', type: 'single', required: true, text: '귀 조직은 현재 인공지능(AI) 기술을 도입하여 활용하고 있습니까?',
              options: ['전사적/조직 전체적으로 도입하여 활발히 활용 중이다', '일부 부서/업무에 시범적으로 도입하여 활용 중이다', '도입을 추진 중이다 (구체적인 계획 수립 단계)', '도입을 검토했으나 현재 보류 중이다', '아직 도입 계획이 없다']
            },
            {
              id: 'Q7', type: 'single', required: true, text: '귀 조직은 생성형 AI(예: ChatGPT, Claude, Gemini, Copilot 등)를 조직 차원에서 도입하였습니까?',
              options: ['조직 차원에서 전체적으로 도입하였다', '조직 차원에서 일부 부서에 도입하였다', '조직 차원의 도입은 없으나 구성원들이 개별적으로 활용한다', '조직 차원에서 활용을 금지/제한하고 있다', '아직 도입하거나 활용하지 않고 있다']
            },
            {
              id: 'Q8', type: 'multiple', required: true, maxSelect: 3, text: 'AI 도입을 하지 않거나 보류한 주된 이유는 무엇입니까?', hint: '(복수 선택, 최대 3개)',
              condition: { questionId: 'Q6', values: ['도입을 검토했으나 현재 보류 중이다', '아직 도입 계획이 없다'] },
              options: ['도입 비용 부담', '기술 인력 및 전문성 부족', '적합한 AI 솔루션을 찾지 못함', 'AI 도입의 필요성을 느끼지 못함', '정보 유출/보안에 대한 우려', '경영진/리더의 이해 및 지원 부족', 'ROI(투자수익률) 불확실', '내부 데이터 부족 또는 품질 문제', '법적 책임 및 규제 이슈 우려', '구성원들의 AI 활용 역량 부족', { label: '기타', hasInput: true }]
            }
          ]
        },
        {
          title: '2.2 AI 도입 계획',
          questions: [
            {
              id: 'Q9', type: 'single', required: true, text: '향후 AI 도입/확대 계획이 있다면, 언제쯤을 예상하십니까?',
              options: ['6개월 이내', '1년 이내', '2~3년 이내', '3년 이후', '향후에도 도입/확대 계획이 없다', '잘 모르겠다']
            }
          ]
        }
      ]
    },
    {
      id: 'part3',
      title: 'Part 3. AI 활용 분야 및 목적',
      note: '※ Part 3~5는 AI를 도입했거나 도입 예정인 조직만 응답',
      sections: [
        {
          title: '3.1 AI 활용 업무 분야',
          questions: [
            {
              id: 'Q10', type: 'multiple', required: true, text: '현재 AI를 활용하고 있거나 활용 예정인 업무 분야는 무엇입니까?', hint: '(복수 선택)',
              options: ['고객 서비스 (챗봇, 상담, 콜센터 등)', '마케팅/영업 (고객 분석, 추천 시스템, 타겟팅 등)', '연구개발(R&D)', '생산/제조 (품질 검사, 공정 최적화, 예지 정비 등)', '물류/공급망 관리', '재무/회계 (이상 거래 탐지, 자동화 등)', '인사/HR (채용, 인재 관리, 교육훈련 등)', 'IT', '법무/컴플라이언스', '경영 전략/의사결정 지원', '교육/학습 콘텐츠 개발', { label: '기타', hasInput: true }]
            }
          ]
        },
        {
          title: '3.2 AI 활용 목적',
          questions: [
            {
              id: 'Q11', type: 'priority', required: true, priorityCount: 3, text: 'AI 기술을 도입하거나 도입을 고려하는 주된 목적은 무엇입니까?', hint: '(우선순위 3개 선택)',
              options: ['업무 효율성/생산성 향상', '비용 절감', '업무 소요 시간 단축', '고객 경험 개선', '데이터 기반 의사결정 강화', '신규 제품/서비스 개발', '경쟁력 확보 및 차별화', '기존 업무의 자동화', '인력 부족 문제 해결', '직원 역량 강화 및 업스킬링', '산업 트렌드 대응', { label: '기타', hasInput: true }]
            }
          ]
        },
        {
          title: '3.3 활용 중인 AI 기술 유형',
          questions: [
            {
              id: 'Q12', type: 'multiple', required: true, text: '현재 귀 조직에서 활용하고 있거나 도입 예정인 AI 기술 유형은 무엇입니까?', hint: '(복수 선택)',
              options: ['생성형 AI (ChatGPT, Claude, Gemini, Copilot 등)', '머신러닝/딥러닝 기반 예측 분석', '자연어 처리 (NLP) - 텍스트 분석, 챗봇 등', '컴퓨터 비전 - 이미지/영상 분석', '음성 인식/합성', '로보틱 프로세스 자동화 (RPA + AI)', 'AI 에이전트 (자율적 의사결정 및 실행)', '멀티모달 AI (텍스트+이미지+음성 등 통합)', '추천 시스템/개인화 엔진', { label: '기타', hasInput: true }]
            }
          ]
        }
      ]
    },
    {
      id: 'part4',
      title: 'Part 4. AI 도입 효과 및 성과',
      sections: [
        {
          title: '4.1 AI 도입 효과',
          questions: [
            {
              id: 'Q13', type: 'multiple', required: true, maxSelect: 3, text: 'AI 도입으로 인해 귀 조직에서 체감하는 가장 큰 효과는 무엇입니까?', hint: '(복수 선택, 최대 3개)',
              options: ['업무 시간 단축', '비용 절감', '업무 품질/정확도 향상', '직원 생산성 향상', '고객 만족도 향상', '데이터 분석 역량 강화', '새로운 비즈니스 기회 발굴', '인력 부족 문제 완화', '아직 가시적인 효과를 체감하지 못함', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q14', type: 'single', required: true, text: 'AI 도입이 귀 조직의 업무 효율성에 어느 정도 기여하고 있습니까?',
              options: ['매우 크게 기여한다', '어느 정도 기여한다', '보통이다', '별로 기여하지 않는다', '전혀 기여하지 않는다', '아직 평가하기 이르다']
            },
            {
              id: 'Q15', type: 'single', required: true, text: 'AI 도입 후 구성원들의 업무 소요 시간이 어떻게 변화하였습니까?',
              options: ['크게 단축되었다 (30% 이상)', '다소 단축되었다 (10~30%)', '약간 단축되었다 (10% 미만)', '변화 없다', '오히려 증가했다', '측정하지 않아 모르겠다']
            }
          ]
        },
        {
          title: '4.2 AI 투자 수익률',
          questions: [
            {
              id: 'Q16', type: 'single', required: true, text: 'AI 프로젝트의 투자수익률(ROI)을 어떻게 평가하십니까?',
              options: ['매우 만족스럽다', '만족스럽다', '보통이다', '불만족스럽다', '매우 불만족스럽다', '아직 ROI를 측정하지 않았다/측정 불가']
            }
          ]
        }
      ]
    },
    {
      id: 'part5',
      title: 'Part 5. AI 도입 시 어려움 및 장애 요인',
      sections: [
        {
          title: '',
          questions: [
            {
              id: 'Q17', type: 'priority', required: true, priorityCount: 3, text: 'AI 도입 및 활용에 있어 가장 큰 어려움/장애 요인은 무엇입니까?', hint: '(우선순위 3개 선택)',
              options: ['초기 투자 비용 부담', 'AI 전문 인력 확보 어려움', '조직 내 AI 역량(리터러시) 부족', '적절한 데이터 확보의 어려움', '데이터 품질 문제', '정보 유출/보안 우려', '기존 IT 인프라와의 통합 어려움', '검증된 AI 솔루션 부재', 'ROI 불확실성', '법적 책임 및 저작권 문제', 'AI 결과물의 신뢰성/정확성 문제', '경영진/리더의 이해 및 지원 부족', '구성원들의 변화에 대한 저항', '명확한 AI 활용 전략 부재', '외부 규제 및 컴플라이언스 이슈', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q18', type: 'single', required: true, text: 'AI를 조직 전체적으로 확산(스케일업)하는 데 가장 큰 걸림돌은 무엇입니까?',
              options: ['조직 전반의 AI 이해도 및 활용 역량 부족', '부서 간 협업 및 데이터 공유 부족', '파일럿 프로젝트에서 실제 적용으로의 전환 어려움', '추가 투자에 대한 경영진 승인 어려움', '성공 사례 부족으로 인한 확신 부족', '표준화된 AI 거버넌스/정책 부재', { label: '기타', hasInput: true }]
            }
          ]
        }
      ]
    },
    {
      id: 'part6',
      title: 'Part 6. AI 투자 현황',
      sections: [
        {
          title: '',
          questions: [
            {
              id: 'Q19', type: 'single', required: true, text: '귀 조직의 연간 AI 관련 투자 규모(인건비, 교육비 포함)는 어느 정도입니까?',
              options: ['1억 원 미만', '1억 원 ~ 5억 원 미만', '5억 원 ~ 10억 원 미만', '10억 원 ~ 50억 원 미만', '50억 원 ~ 100억 원 미만', '100억 원 이상', '별도로 AI 예산을 책정하지 않음', '응답하기 어려움']
            },
            {
              id: 'Q20', type: 'single', required: true, text: '향후 1년간 AI 관련 투자는 어떻게 변화할 예정입니까?',
              options: ['대폭 증가할 예정이다 (50% 이상)', '다소 증가할 예정이다 (10~50%)', '현재 수준을 유지할 예정이다', '다소 감소할 예정이다', '대폭 감소할 예정이다', '아직 결정되지 않았다']
            }
          ]
        }
      ]
    },
    {
      id: 'part7',
      title: 'Part 7. AI 인력 및 조직',
      sections: [
        {
          title: '',
          questions: [
            {
              id: 'Q21', type: 'single', required: true, text: '귀 조직에 AI 전담 조직(팀, 부서)이 있습니까?',
              options: ['별도의 AI 전담 조직이 있다', 'IT/디지털 부서 내에 AI 담당 인력이 있다', '각 부서에 AI 담당자가 분산되어 있다', 'AI 전담 인력/조직이 없다', '외부 전문업체에 위탁하고 있다']
            },
            {
              id: 'Q22', type: 'single', required: true, text: '귀 조직의 AI 관련 인력(내부)은 몇 명입니까?',
              options: ['없음', '1~4명', '5~9명', '10~29명', '30~49명', '50명 이상', '파악하기 어려움']
            },
            {
              id: 'Q23', type: 'multiple', required: true, maxSelect: 2, text: 'AI 인력 및 역량 확보를 위해 가장 필요한 것은 무엇입니까?', hint: '(복수 선택, 최대 2개)',
              options: ['AI 전문 인력 채용 확대', '기존 구성원 대상 AI 재교육/역량 강화', '외부 AI 전문업체와의 협력 강화', 'AI 교육 프로그램/인증 지원', '산학협력을 통한 인재 양성', '처우 개선을 통한 인재 유치', { label: '기타', hasInput: true }]
            }
          ]
        }
      ]
    },
    {
      id: 'part8',
      title: 'Part 8. AI 교육 및 역량 개발',
      note: '※ 이 파트는 모든 응답자가 응답',
      sections: [
        {
          title: '8.1 AI 교육 현황',
          questions: [
            {
              id: 'Q24', type: 'single', required: true, text: '귀 조직은 구성원 대상 AI 교육/훈련 프로그램을 운영하고 있습니까?',
              options: ['전 구성원 대상으로 체계적으로 운영 중이다', '일부 구성원/부서 대상으로 운영 중이다', '도입을 검토 중이다', '운영하지 않고 있다']
            },
            {
              id: 'Q25', type: 'multiple', required: true, text: '현재 운영 중인 AI 교육의 형태는 무엇입니까?', hint: '(복수 선택)',
              condition: { questionId: 'Q24', values: ['전 구성원 대상으로 체계적으로 운영 중이다', '일부 구성원/부서 대상으로 운영 중이다'] },
              options: ['사내 강사에 의한 자체 교육', '외부 전문 교육기관 위탁 교육', '온라인 학습 플랫폼 (Coursera, Udemy 등) 활용', 'AI 솔루션 도입 업체의 사용자 교육', '세미나/컨퍼런스 참가', '사내 학습 커뮤니티/스터디 그룹', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q26', type: 'single', required: true, text: '현재 AI 교육의 만족도는 어떠합니까?',
              condition: { questionId: 'Q24', values: ['전 구성원 대상으로 체계적으로 운영 중이다', '일부 구성원/부서 대상으로 운영 중이다'] },
              options: ['매우 만족한다', '만족한다', '보통이다', '불만족한다', '매우 불만족한다']
            },
            {
              id: 'Q27', type: 'multiple', required: true, maxSelect: 2, text: '현재 AI 교육의 가장 큰 개선 필요 사항은 무엇입니까?', hint: '(복수 선택, 최대 2개)',
              condition: { questionId: 'Q24', values: ['전 구성원 대상으로 체계적으로 운영 중이다', '일부 구성원/부서 대상으로 운영 중이다'] },
              options: ['교육 내용의 실무 적용성 강화', '다양한 직무/레벨별 맞춤형 교육 필요', '최신 AI 트렌드 반영', '실습/핸즈온 교육 확대', '교육 시간 확보의 어려움', '교육 효과 측정 체계 필요', { label: '기타', hasInput: true }]
            }
          ]
        },
        {
          title: '8.2 AI 교육 수요',
          questions: [
            {
              id: 'Q28', type: 'multiple', required: true, text: '귀 조직에서 AI 교육이 필요한 대상은 누구라고 생각하십니까?', hint: '(복수 선택)',
              options: ['경영진/임원', '중간관리자 (팀장/부장급)', '실무자 전체', 'IT/개발 부서 직원', '인사/HR 담당자', '기획/전략 담당자', '마케팅/영업 담당자', '연구개발(R&D) 인력', '신입사원', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q29', type: 'priority', required: true, priorityCount: 3, text: 'AI 시대에 구성원에게 가장 필요하다고 생각하는 역량은 무엇입니까?', hint: '(우선순위 3개 선택)',
              options: ['AI 도구 활용 능력 (ChatGPT, Copilot 등 실무 활용)', '프롬프트 엔지니어링 (AI에게 효과적으로 지시하는 능력)', '데이터 분석 및 해석 능력', 'AI 결과물 검증 및 비판적 사고', 'AI 기반 업무 프로세스 설계 능력', 'AI 윤리 및 리스크 관리 이해', '창의적 사고 및 문제 해결 능력', 'AI와 협업하는 커뮤니케이션 능력', '변화 관리 및 적응력', 'AI 기술 기초 이해 (원리, 한계 등)', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q30', type: 'priority', required: true, priorityCount: 3, text: '귀 조직에서 가장 관심 있는 AI 교육 주제는 무엇입니까?', hint: '(우선순위 3개 선택)',
              options: ['생성형 AI 업무 활용 (ChatGPT, Claude 등)', '프롬프트 엔지니어링 실무', 'AI를 활용한 문서 작성/보고서 작성', 'AI를 활용한 데이터 분석', 'AI를 활용한 마케팅/콘텐츠 제작', 'AI를 활용한 코딩/개발 생산성 향상', 'AI 기반 업무 자동화 (RPA+AI)', 'HR/인사 분야 AI 활용', 'AI 전략 수립 및 도입 방법론', 'AI 윤리 및 거버넌스', 'AI 리더십/변화관리', 'AI 프로젝트 관리', '산업별 AI 적용 사례', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q31', type: 'multiple', required: true, maxSelect: 2, text: '귀 조직에서 선호하는 AI 교육 방식은 무엇입니까?', hint: '(복수 선택, 최대 2개)',
              options: ['오프라인 집합 교육 (강의실 교육)', '실시간 온라인 교육 (화상 강의)', '온라인 비동기 학습 (동영상 강의)', '워크숍/실습 중심 교육', '컨설팅형 맞춤 교육 (조직 맞춤형)', '코칭/멘토링', '자기주도 학습 지원 (학습 플랫폼 제공)', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q32', type: 'single', required: true, text: 'AI 교육의 적정 교육 시간은 어느 정도라고 생각하십니까?',
              options: ['2~4시간 (반나절)', '8시간 (1일)', '16시간 (2일)', '24시간 이상 (3일 이상)', '정기적인 단기 교육 (월 1회 2~3시간 등)', '주제에 따라 다름']
            },
            {
              id: 'Q33', type: 'single', required: true, text: '향후 1년 내 AI 교육에 대한 투자 계획은 어떠합니까?',
              options: ['대폭 확대할 예정이다', '다소 확대할 예정이다', '현재 수준을 유지할 예정이다', '축소할 예정이다', '아직 결정되지 않았다', 'AI 교육에 투자할 계획이 없다']
            },
            {
              id: 'Q34', type: 'priority', required: true, priorityCount: 3, text: 'AI 교육 프로그램 선정 시 가장 중요하게 고려하는 요소는 무엇입니까?', hint: '(우선순위 3개 선택)',
              options: ['교육 내용의 실무 적용 가능성', '강사/교육기관의 전문성 및 신뢰도', '최신 AI 트렌드 및 기술 반영', '교육 비용', '교육 시간 및 일정 유연성', '실습/핸즈온 콘텐츠 포함 여부', '수료증/인증서 발급', '사후 지원 (Q&A, 후속 학습 등)', '맞춤형 교육 가능 여부', { label: '기타', hasInput: true }]
            }
          ]
        },
        {
          title: '8.3 직무별 AI 역량 수준 현황',
          questions: [
            {
              id: 'Q35', type: 'single', required: true, text: '귀 조직 구성원들의 전반적인 AI 활용 역량 수준은 어느 정도라고 평가하십니까?',
              options: ['매우 높다 (AI를 적극적으로 업무에 활용하고 있음)', '높은 편이다 (기본적인 AI 도구를 업무에 활용함)', '보통이다 (일부 구성원만 AI를 활용함)', '낮은 편이다 (AI 활용에 어려움을 겪음)', '매우 낮다 (AI를 거의 활용하지 못함)', '평가하기 어렵다']
            },
            {
              id: 'Q36', type: 'multiple', required: true, maxSelect: 2, text: 'AI 역량 강화가 가장 시급한 직무/계층은 무엇입니까?', hint: '(복수 선택, 최대 2개)',
              options: ['경영진/임원 (AI 전략적 의사결정)', '중간관리자 (팀 내 AI 활용 리딩)', '일반 실무자 (업무 생산성 향상)', '신입사원/주니어 (기본 역량 확보)', 'IT/개발자 (AI 개발 및 통합)', '기획/전략 담당자 (AI 기반 전략 수립)', '인사/HR 담당자 (AI 기반 인재관리)', { label: '기타', hasInput: true }]
            }
          ]
        }
      ]
    },
    {
      id: 'part9',
      title: 'Part 9. AI 거버넌스 및 윤리',
      sections: [
        {
          title: '',
          questions: [
            {
              id: 'Q37', type: 'single', required: true, text: '귀 조직은 AI 활용에 관한 내부 가이드라인/정책이 있습니까?',
              options: ['명문화된 AI 활용 정책이 있다', '비공식적인 가이드라인이 있다', '정책 수립을 검토 중이다', '정책이나 가이드라인이 없다']
            },
            {
              id: 'Q38', type: 'multiple', required: true, maxSelect: 3, text: 'AI 활용 시 가장 우려되는 윤리적/법적 이슈는 무엇입니까?', hint: '(복수 선택, 최대 3개)',
              options: ['개인정보 보호 및 프라이버시', '데이터 보안 및 기밀 유출', 'AI 생성물의 저작권/지식재산권 문제', 'AI 결과물의 정확성 및 신뢰성 (할루시네이션 등)', '알고리즘 편향 및 차별 문제', '일자리 감소에 따른 사회적 책임', 'AI 의사결정의 투명성/설명가능성', '법적 책임 소재 불분명', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q39', type: 'multiple', required: true, text: '생성형 AI 사용 시 정보 유출 방지를 위해 어떤 조치를 취하고 있습니까?', hint: '(복수 선택)',
              options: ['사내 전용 AI 시스템 구축', '외부 AI 서비스 사용 시 입력 데이터 제한', '민감 정보/기밀 데이터 입력 금지 정책', 'AI 사용 내역 모니터링', '구성원 대상 AI 보안 교육 실시', '별도의 조치를 취하지 않고 있다', { label: '기타', hasInput: true }]
            }
          ]
        }
      ]
    },
    {
      id: 'part10',
      title: 'Part 10. 외부 지원 수요',
      sections: [
        {
          title: '',
          questions: [
            {
              id: 'Q40', type: 'multiple', required: true, maxSelect: 3, text: 'AI 도입/활용을 위해 외부 지원 중 가장 필요한 것은 무엇입니까?', hint: '(복수 선택, 최대 3개)',
              options: ['AI 기술 개발 및 도입 자금 지원', 'AI 전문 인력 양성 교육 프로그램', 'AI 도입 컨설팅 및 멘토링 지원', '중소기업용 AI 솔루션/플랫폼 제공', '데이터 공유 및 활용 플랫폼 구축', 'AI 관련 법규 및 가이드라인 정비', 'AI 보안/인증 체계 마련', '세제 혜택 및 인센티브', 'AI 성공 사례 및 베스트 프랙티스 공유', '산업별/직무별 AI 활용 교육', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q41', type: 'single', required: true, text: '외부 AI 교육 서비스 이용 경험이 있습니까?',
              options: ['이용 경험이 있으며 만족스러웠다', '이용 경험이 있으나 개선이 필요하다', '이용 경험이 없으나 관심이 있다', '이용 경험이 없으며 관심도 없다']
            },
            {
              id: 'Q42', type: 'multiple', required: true, maxSelect: 2, text: '외부 AI 교육 서비스 선정 시 가장 중요하게 고려하는 것은 무엇입니까?', hint: '(복수 선택, 최대 2개)',
              condition: { questionId: 'Q41', values: ['이용 경험이 없으나 관심이 있다'] },
              options: ['교육기관/강사의 전문성 및 경력', '실제 업무 적용 사례 중심의 커리큘럼', '교육 비용 대비 효과', '시간 및 장소의 유연성', '수료 후 지속적인 지원', '인증/자격증 연계', '타 기업 수강 후기 및 평판', { label: '기타', hasInput: true }]
            }
          ]
        }
      ]
    },
    {
      id: 'part11',
      title: 'Part 11. 향후 전망 및 제언',
      sections: [
        {
          title: '',
          questions: [
            {
              id: 'Q43', type: 'single', required: true, text: '앞으로 2~3년 내 귀 조직이 속한 산업/분야에서 AI가 미칠 영향은 어느 정도라고 예상하십니까?',
              options: ['산업/분야 전반을 크게 변화시킬 것이다', '상당한 영향을 미칠 것이다', '일부 영역에서 영향을 미칠 것이다', '큰 영향은 없을 것이다', '잘 모르겠다']
            },
            {
              id: 'Q44', type: 'single', required: true, text: 'AI가 귀 조직의 고용/인력 구조에 미칠 영향을 어떻게 예상하십니까?',
              options: ['전체 인력이 증가할 것이다', '전체 인력은 유지되고 역할이 변화할 것이다', '일부 인력이 감소할 것이다', '상당한 인력 감소가 있을 것이다', '영향이 없을 것이다', '예측하기 어렵다']
            },
            {
              id: 'Q45', type: 'multiple', required: true, maxSelect: 2, text: 'AI 시대에 가장 중요한 HR/인재관리의 과제는 무엇이라고 생각하십니까?', hint: '(복수 선택, 최대 2개)',
              options: ['AI 활용 역량을 갖춘 인재 확보', '기존 인력의 AI 역량 개발 (리스킬링/업스킬링)', 'AI로 대체되는 인력의 재배치/전환', 'AI와 인간의 효과적인 협업 체계 구축', 'AI 시대에 맞는 성과관리 체계 재설계', '조직 문화의 디지털/AI 친화적 변화', 'AI 기반 HR 프로세스 혁신', { label: '기타', hasInput: true }]
            },
            {
              id: 'Q46', type: 'textarea', required: false, text: 'AI 교육 및 조직 내 AI 역량 강화와 관련하여 추가적으로 의견이 있으시면 자유롭게 기술해 주십시오.',
              placeholder: '자유롭게 의견을 작성해 주세요...'
            }
          ]
        }
      ]
    },
    {
      id: 'part12',
      title: 'Part 12. 추가 정보 (선택)',
      sections: [
        {
          title: '',
          questions: [
            {
              id: 'Q47', type: 'single', required: true, text: '한국HR포럼에서 제공하는 AI 관련 교육/세미나 정보를 받아보시겠습니까?',
              options: ['예, 정보를 받아보겠습니다', '아니오, 정보 수신을 원하지 않습니다']
            },
            {
              id: 'Q48', type: 'email', required: false, text: '연락받으실 이메일 주소를 기재해 주십시오.', hint: '(선택)',
              condition: { questionId: 'Q47', values: ['예, 정보를 받아보겠습니다'] },
              placeholder: 'example@company.com'
            },
            {
              id: 'Q49', type: 'multiple', required: false, text: '가장 관심 있는 분야를 선택해 주십시오.', hint: '(복수 선택)',
              condition: { questionId: 'Q47', values: ['예, 정보를 받아보겠습니다'] },
              options: ['AI 활용 실무 교육', 'AI 리더십/변화관리 교육', 'AI 전략 수립 컨설팅', 'HR/인사 분야 AI 활용', '산업별 AI 적용 세미나', 'AI 트렌드 리포트/뉴스레터', { label: '기타', hasInput: true }]
            }
          ]
        }
      ]
    }
  ]
};

// App State
let currentPart = 0;
let responses = {};
let prioritySelections = {};

// DOM Elements
const surveyContent = document.getElementById('surveyContent');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const navDots = document.getElementById('navDots');
const progressFill = document.getElementById('progressFill');
const progressPart = document.getElementById('progressPart');
const progressPercent = document.getElementById('progressPercent');
const successModal = document.getElementById('successModal');
const themeToggle = document.getElementById('themeToggle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSavedResponses();
  renderSurvey();
  renderNavDots();
  updateNavigation();
  updateProgress();
  initTheme();
  setupEventListeners();
});

// Theme
function initTheme() {
  const saved = localStorage.getItem('survey-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('survey-theme', next);
});

// Render Survey
function renderSurvey() {
  surveyContent.innerHTML = surveyData.parts.map((part, idx) => `
    <div class="survey-part ${idx === 0 ? 'active' : ''}" data-part="${idx}">
      <div class="part-header">
        <h2 class="part-title">${part.title}</h2>
        ${part.note ? `<div class="part-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${part.note}</div>` : ''}
      </div>
      ${part.sections.map(section => `
        <div class="survey-section">
          ${section.title ? `<h3 class="section-title">${section.title}</h3>` : ''}
          ${section.questions.map(q => renderQuestion(q)).join('')}
        </div>
      `).join('')}
    </div>
  `).join('');
}

function renderQuestion(q) {
  const isConditional = q.condition ? 'conditional' : '';
  const conditionData = q.condition ? `data-condition-q="${q.condition.questionId}" data-condition-v='${JSON.stringify(q.condition.values)}'` : '';

  let optionsHtml = '';
  if (q.type === 'single' || q.type === 'multiple' || q.type === 'priority') {
    const inputType = q.type === 'single' ? 'radio' : 'checkbox';
    const maxSelect = q.maxSelect || (q.type === 'priority' ? q.priorityCount : null);

    optionsHtml = `
      ${maxSelect ? `<div class="selection-counter"><span class="selection-counter-text">${q.type === 'priority' ? '우선순위 순서대로 선택' : `최대 ${maxSelect}개 선택`}</span><span class="selection-counter-count" id="count-${q.id}">0 / ${maxSelect}</span></div>` : ''}
      <div class="options-list" ${maxSelect ? `data-max="${maxSelect}"` : ''}>
        ${q.options.map((opt, i) => {
      const isObj = typeof opt === 'object';
      const label = isObj ? opt.label : opt;
      const value = label;
      return `
            <div class="option-item">
              <input type="${inputType}" id="${q.id}-${i}" name="${q.id}" value="${value}" class="option-input" ${responses[q.id] === value || (Array.isArray(responses[q.id]) && responses[q.id].includes(value)) ? 'checked' : ''}>
              <label for="${q.id}-${i}" class="option-label">
                ${q.type === 'priority' ? '<span class="priority-badge"></span>' : ''}
                <span class="option-indicator"></span>
                <span class="option-text">${label}</span>
              </label>
              ${isObj && opt.hasInput ? `<div class="other-input-wrapper"><input type="text" class="other-input" placeholder="구체적으로 입력해 주세요" data-for="${q.id}"></div>` : ''}
            </div>
          `;
    }).join('')}
      </div>
    `;
  } else if (q.type === 'textarea') {
    optionsHtml = `<div class="textarea-wrapper"><textarea class="textarea-input" id="${q.id}" name="${q.id}" placeholder="${q.placeholder || ''}">${responses[q.id] || ''}</textarea></div>`;
  } else if (q.type === 'email') {
    optionsHtml = `<input type="email" class="email-input" id="${q.id}" name="${q.id}" placeholder="${q.placeholder || ''}" value="${responses[q.id] || ''}">`;
  }

  return `
    <div class="question-card ${isConditional}" id="card-${q.id}" ${conditionData}>
      <div class="question-header">
        <span class="question-number">${q.id}</span>
        <div class="question-text">
          ${q.text}${q.required ? '<span class="question-required">*</span>' : ''}
          ${q.hint ? `<div class="question-hint">${q.hint}</div>` : ''}
        </div>
      </div>
      ${optionsHtml}
      <div class="error-message" id="error-${q.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><span>이 질문에 응답해 주세요.</span></div>
    </div>
  `;
}

// Event Listeners
function setupEventListeners() {
  surveyContent.addEventListener('change', handleInputChange);
  surveyContent.addEventListener('input', handleTextInput);
  prevBtn.addEventListener('click', goToPrevPart);
  nextBtn.addEventListener('click', goToNextPart);
  document.getElementById('surveyForm').addEventListener('submit', handleSubmit);
}

function handleInputChange(e) {
  if (!e.target.matches('.option-input')) return;

  const name = e.target.name;
  const value = e.target.value;
  const type = e.target.type;
  const card = e.target.closest('.question-card');
  const optionsList = card.querySelector('.options-list');
  const maxSelect = optionsList?.dataset.max ? parseInt(optionsList.dataset.max) : null;

  if (type === 'radio') {
    responses[name] = value;
  } else {
    if (!responses[name]) responses[name] = [];
    if (e.target.checked) {
      if (maxSelect && responses[name].length >= maxSelect) {
        e.target.checked = false;
        return;
      }
      responses[name].push(value);
    } else {
      responses[name] = responses[name].filter(v => v !== value);
    }
  }

  // Update counter
  if (maxSelect) {
    const counter = document.getElementById(`count-${name}`);
    if (counter) counter.textContent = `${responses[name]?.length || 0} / ${maxSelect}`;
  }

  // Priority badges
  updatePriorityBadges(name);

  // Show/hide other input
  const option = e.target.closest('.option-item');
  const otherInput = option?.querySelector('.other-input-wrapper');
  if (otherInput) {
    otherInput.classList.toggle('visible', e.target.checked);
  }

  // Check conditions
  checkConditions(name);

  // Clear error
  card.classList.remove('has-error');
  document.getElementById(`error-${name}`)?.classList.remove('visible');

  saveResponses();
  updateProgress();
}

function handleTextInput(e) {
  if (e.target.matches('.textarea-input, .email-input')) {
    responses[e.target.name] = e.target.value;
    saveResponses();
  } else if (e.target.matches('.other-input')) {
    const qId = e.target.dataset.for;
    if (!responses[`${qId}_other`]) responses[`${qId}_other`] = {};
    responses[`${qId}_other`] = e.target.value;
    saveResponses();
  }
}

function updatePriorityBadges(name) {
  const card = document.getElementById(`card-${name}`);
  if (!card) return;

  const badges = card.querySelectorAll('.priority-badge');
  const checked = card.querySelectorAll('.option-input:checked');

  badges.forEach(b => b.textContent = '');
  checked.forEach((input, i) => {
    const badge = input.closest('.option-item').querySelector('.priority-badge');
    if (badge) badge.textContent = i + 1;
  });
}

function checkConditions(changedQ) {
  document.querySelectorAll('.question-card[data-condition-q]').forEach(card => {
    const triggerQ = card.dataset.conditionQ;
    if (triggerQ !== changedQ) return;

    const values = JSON.parse(card.dataset.conditionV);
    const answer = responses[triggerQ];
    const visible = values.some(v => answer === v || (Array.isArray(answer) && answer.includes(v)));

    card.classList.toggle('visible', visible);
    if (!visible) {
      const qId = card.id.replace('card-', '');
      delete responses[qId];
    }
  });
}

// Navigation
function renderNavDots() {
  navDots.innerHTML = surveyData.parts.map((_, i) =>
    `<div class="nav-dot ${i === 0 ? 'active' : ''}" data-part="${i}"></div>`
  ).join('');

  navDots.addEventListener('click', e => {
    if (e.target.matches('.nav-dot')) {
      const target = parseInt(e.target.dataset.part);
      if (target < currentPart || validateCurrentPart()) {
        goToPart(target);
      }
    }
  });
}

function goToPart(idx) {
  document.querySelectorAll('.survey-part').forEach((p, i) => {
    p.classList.toggle('active', i === idx);
  });
  document.querySelectorAll('.nav-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
    d.classList.toggle('completed', i < idx);
  });
  currentPart = idx;
  updateNavigation();
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPrevPart() {
  if (currentPart > 0) goToPart(currentPart - 1);
}

function goToNextPart() {
  if (validateCurrentPart()) {
    if (currentPart < surveyData.parts.length - 1) {
      goToPart(currentPart + 1);
    }
  }
}

function updateNavigation() {
  prevBtn.disabled = currentPart === 0;
  const isLast = currentPart === surveyData.parts.length - 1;
  nextBtn.style.display = isLast ? 'none' : 'flex';
  submitBtn.style.display = isLast ? 'flex' : 'none';
}

function updateProgress() {
  const total = surveyData.parts.length;
  const percent = Math.round(((currentPart + 1) / total) * 100);
  progressFill.style.width = `${percent}%`;
  progressPart.textContent = `Part ${currentPart + 1} / ${total}`;
  progressPercent.textContent = `${percent}%`;
}

// Validation
function validateCurrentPart() {
  const part = surveyData.parts[currentPart];
  let valid = true;

  part.sections.forEach(section => {
    section.questions.forEach(q => {
      const card = document.getElementById(`card-${q.id}`);
      if (!card || (card.classList.contains('conditional') && !card.classList.contains('visible'))) return;

      if (q.required) {
        const answer = responses[q.id];
        const isEmpty = !answer || (Array.isArray(answer) && answer.length === 0);

        if (isEmpty) {
          valid = false;
          card.classList.add('has-error');
          document.getElementById(`error-${q.id}`)?.classList.add('visible');
        }
      }
    });
  });

  if (!valid) {
    const firstError = document.querySelector('.question-card.has-error');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}

// Submit
async function handleSubmit(e) {
  e.preventDefault();
  if (!validateCurrentPart()) return;

  const data = {
    submittedAt: new Date().toISOString(),
    responses: { ...responses }
  };

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
    저장 중...
  `;

  try {
    // Google Sheets로 전송
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_WEB_APP_URL_HERE') {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for Google Apps Script Web App
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log('Google Sheets 저장 요청 전송됨 (no-cors)');
    } else {
      console.warn('Google Script URL이 설정되지 않았습니다.');
      console.log('Survey Submitted:', data);
    }

    localStorage.removeItem('survey-responses');
    successModal.classList.add('visible');

  } catch (error) {
    console.error('저장 중 오류:', error);
    alert('저장 중 오류가 발생했습니다.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `제출하기 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg>`;
  }
}

// Storage
function saveResponses() {
  localStorage.setItem('survey-responses', JSON.stringify(responses));
}

function loadSavedResponses() {
  const saved = localStorage.getItem('survey-responses');
  if (saved) {
    responses = JSON.parse(saved);
    // Restore conditional visibility
    setTimeout(() => {
      Object.keys(responses).forEach(q => checkConditions(q));
    }, 100);
  }
}
