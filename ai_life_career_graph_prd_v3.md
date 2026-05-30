# AI 해커톤 서비스 기획서 v2: 심층 인터뷰 기반 인생관·커리어 그래프 자기정의 서비스

## 1. 서비스 개요

### 서비스 가칭

**Life Career Graph**

대체 후보명:

- **OneLine Me**
- **Persona Graph**
- **내면지도**
- **MeMap**
- **Career Compass**

### 한 줄 설명

사용자가 인생관과 커리어에 대한 코어 질문에 답하면, AI가 답변을 바탕으로 심층 꼬리질문을 생성하고, 반복 인터뷰를 통해 수집된 답변을 그래프와 한 문장 정체성으로 정리하는 서비스.

### 핵심 컨셉

이 서비스는 단순한 고정 질문형 자기분석 서비스가 아니라, **사용자의 답변에 따라 질문이 깊어지는 AI 자기성찰 인터뷰 서비스**이다.

사용자는 먼저 인생관 또는 커리어에 대한 코어 질문에 답변한다. AI는 해당 답변에서 추상적 표현, 중요한 경험, 감정, 선택 기준, 가치 충돌, 반복 키워드를 찾아 여러 개의 심층 질문을 제시한다. 사용자는 원하는 질문에 답변하고, 각 답변에 대해 다시 꼬리질문을 받을 수 있다. 이 과정을 원하는 만큼 반복하다가 현재 코어 질문을 마무리하거나 다음 코어 질문으로 넘어간다.

서비스는 이렇게 수집된 모든 답변을 구조화하고, 유사하거나 연결 가능한 요소를 찾아 그래프로 시각화한다. 반복적으로 등장하는 가치와 패턴에는 더 높은 가중치를 부여하여 사용자를 정의한다.

예시 결과:

> 나는 복잡한 경험 속에서 의미 있는 패턴을 찾아내고, 그것을 실질적인 변화로 연결하려는 사람입니다.

---

## 2. 문제 정의

많은 사람은 자신에 대해 생각할 기회는 많지만, 그 생각을 명확한 언어로 정리하기 어렵다. 특히 자기소개서, 면접, 포트폴리오, 커리어 전환 상황에서는 단순한 성격 키워드가 아니라 실제 경험과 가치관을 근거로 자신을 설명해야 한다.

기존 성격 테스트는 빠르지만 개인의 실제 언어와 맥락을 충분히 반영하지 못한다. 일반적인 AI 챗봇은 대화는 가능하지만 결과가 구조화되지 않아 사용자가 다시 정리해야 한다.

이 서비스는 다음 문제를 해결한다.

- 사용자가 스스로 생각을 깊게 확장하기 어렵다.
- 첫 답변은 보통 추상적이거나 짧다.
- 자기소개에 필요한 핵심 가치, 강점, 경험, 커리어 방향이 흩어져 있다.
- 반복적으로 드러나는 패턴과 일회성 답변을 구분하기 어렵다.
- 자기이해 결과를 시각적으로 확인하기 어렵다.

---

## 3. 핵심 사용자 경험

### 기존 방식

```text
고정 질문 10개 답변
→ AI 분석
→ 그래프와 한 문장 생성
```

### 수정된 방식

```text
코어 질문 선택
→ 사용자가 1차 답변 작성
→ AI가 답변 기반 심층 질문 여러 개 생성
→ 사용자가 원하는 심층 질문에 답변
→ 각 심층 답변에 대해 다시 꼬리질문 생성
→ 사용자가 원하는 만큼 반복
→ 현재 코어 질문 마무리 또는 다음 코어 질문 이동
→ 전체 답변 구조화
→ 유사 패턴 병합 및 가중치 계산
→ 그래프 생성
→ 나를 표현하는 한 문장 생성
```

### 핵심 UX 원칙

- 사용자가 모든 심층 질문에 반드시 답해야 하는 구조가 아니어야 한다.
- 사용자는 언제든지 “이 질문 마무리” 또는 “다음 코어 질문으로 이동”을 선택할 수 있어야 한다.
- AI는 한 번에 하나의 정답을 요구하는 것이 아니라, 사용자가 자기성찰을 확장할 수 있는 선택지를 제공해야 한다.
- 심층 질문은 여러 개를 제시하되, 사용자가 부담을 느끼지 않도록 2~4개 수준으로 제한한다.
- 반복 인터뷰는 깊이를 만들기 위한 기능이므로, 무한정 늘어지지 않게 추천 종료 조건을 둔다.

---

## 4. MVP 범위

### MVP 목표

사용자가 4~6개의 코어 질문을 기준으로 AI 심층 인터뷰를 진행하고, 수집된 모든 답변에서 반복 패턴을 추출하여 그래프와 한 문장 자기정의 결과를 제공한다.

### MVP에 반드시 포함할 기능

- 랜딩 페이지
- 인터뷰 시작 화면
- 인생관 코어 질문
- 커리어 코어 질문
- 답변 입력 UI
- 답변 기반 심층 질문 생성
- 심층 질문 선택 및 답변 UI
- 심층 질문 반복 사이클
- 현재 코어 질문 마무리 버튼
- 다음 코어 질문 이동 버튼
- 전체 답변 구조화
- 유사 키워드·유사 의미 병합
- 가중치 기반 그래프 생성
- 나를 표현하는 한 문장 생성
- 결과 요약 카드

### MVP에서 제외해도 되는 기능

- 로그인
- 결제
- 장기 데이터 저장
- 여러 세션 비교
- 음성 인터뷰
- PDF 다운로드
- SNS 공유 자동화
- 고급 애니메이션
- 복잡한 그래프 편집 기능

---

## 5. 인터뷰 진행 방식

## 5.1 기본 단위

인터뷰는 다음 단위로 구성된다.

```text
Session
  └─ Core Question Thread
       ├─ Core Answer
       ├─ Follow-up Question Group
       │    ├─ Follow-up Question A
       │    │    └─ User Answer
       │    │         └─ Next Follow-up Question Group
       │    ├─ Follow-up Question B
       │    │    └─ User Answer
       │    └─ Follow-up Question C
       │         └─ User Answer
       └─ Thread Summary
```

### 용어 정의

| 용어 | 의미 |
|---|---|
| Core Question | 인생관 또는 커리어를 묻는 상위 질문 |
| Core Answer | 사용자가 코어 질문에 작성한 최초 답변 |
| Follow-up Question | 특정 답변을 바탕으로 생성된 심층 질문 |
| Follow-up Answer | 심층 질문에 대한 사용자 답변 |
| Question Thread | 하나의 코어 질문에서 파생된 모든 질문·답변 묶음 |
| Depth | 코어 질문에서 몇 단계까지 심층 질문이 이어졌는지 나타내는 값 |
| Thread Close | 사용자가 해당 코어 질문을 마무리하는 행위 |

---

## 5.2 인터뷰 플로우

```text
1. 사용자가 코어 질문을 확인한다.
2. 사용자가 코어 질문에 답변한다.
3. AI가 답변을 분석한다.
4. AI가 심층 질문 2~4개를 생성한다.
5. 사용자는 다음 중 하나를 선택한다.
   - 특정 심층 질문에 답변하기
   - 다른 심층 질문 보기
   - 이 코어 질문 마무리하기
   - 다음 코어 질문으로 넘어가기
6. 사용자가 심층 질문에 답변한다.
7. AI가 해당 답변을 다시 분석한다.
8. AI가 다음 단계 심층 질문을 생성한다.
9. 사용자는 원하는 만큼 5~8번을 반복한다.
10. 사용자가 질문을 마무리하면 해당 코어 질문 스레드를 요약한다.
11. 다음 코어 질문으로 이동한다.
12. 모든 스레드가 끝나면 전체 분석을 실행한다.
```

---

## 5.3 사용자가 선택할 수 있는 액션

인터뷰 화면에는 다음 액션이 필요하다.

| 액션 | 설명 |
|---|---|
| 답변 저장 | 현재 질문에 대한 답변을 저장한다. |
| 심층 질문 생성 | 답변을 기반으로 AI가 후속 질문을 생성한다. |
| 이 질문에 답변하기 | 여러 심층 질문 중 하나를 선택해 답변한다. |
| 다른 질문 선택 | 현재 생성된 다른 심층 질문으로 이동한다. |
| 추가로 더 파고들기 | 현재 답변에 대해 다음 단계 꼬리질문을 생성한다. |
| 현재 코어 질문 마무리 | 해당 코어 질문 스레드를 종료하고 요약한다. |
| 다음 코어 질문으로 이동 | 현재 스레드를 닫고 다음 코어 질문으로 이동한다. |
| 전체 분석하기 | 충분한 답변이 쌓이면 결과 분석으로 넘어간다. |

---

## 5.4 반복 종료 조건

사용자가 원하는 만큼 반복할 수 있어야 하지만, UX와 비용 관점에서 추천 종료 조건을 둔다.

### 시스템 추천 종료 조건

다음 중 하나에 해당하면 AI는 “이 질문은 충분히 깊게 탐색되었습니다”라고 안내할 수 있다.

- 한 코어 질문의 심층 depth가 3 이상인 경우
- 하나의 코어 질문에서 답변이 5개 이상 수집된 경우
- 같은 가치 또는 감정 키워드가 3회 이상 반복된 경우
- 사용자의 답변이 더 이상 새로운 정보를 거의 제공하지 않는 경우
- 답변이 지나치게 짧아지고 반복 표현이 많아지는 경우

### 사용자 종료 조건

사용자는 언제든지 다음 버튼을 누를 수 있다.

```text
이 질문은 여기까지 할래요
다음 질문으로 넘어갈래요
전체 분석으로 넘어갈래요
```

---

## 6. 질문 설계

## 6.1 코어 질문 설계 원칙

코어 질문은 너무 세부적이면 안 된다. 사용자의 답변에서 다양한 심층 질문이 파생될 수 있도록 넓은 질문이어야 한다.

좋은 코어 질문의 조건:

- 경험, 가치, 감정, 선택 기준을 모두 끌어낼 수 있다.
- 사용자가 자기 이야기를 시작하기 쉽다.
- 답변 이후 여러 방향의 후속 질문을 만들 수 있다.
- 인생관과 커리어를 연결할 수 있다.

---

## 6.2 인생관 코어 질문 후보

### Life 01

최근 몇 년 동안 가장 크게 변했다고 느끼는 부분은 무엇인가요?

추출 대상:

- 변화 계기
- 성장 방향
- 자기 인식
- 가치관 변화

### Life 02

당신이 좋은 삶이라고 느끼는 삶은 어떤 모습인가요?

추출 대상:

- 핵심 가치
- 삶의 우선순위
- 만족 조건
- 장기적 욕구

### Life 03

어떤 순간에 “이건 나답다”고 느끼나요?

추출 대상:

- 자기 정체성
- 자연스러운 행동 패턴
- 몰입 조건
- 자기표현 방식

### Life 04

반대로 어떤 상황에서 가장 답답함이나 불편함을 느끼나요?

추출 대상:

- 회피 요소
- 가치 충돌
- 스트레스 원인
- 싫어하는 환경

---

## 6.3 커리어 코어 질문 후보

### Career 01

지금까지 가장 몰입했던 일이나 프로젝트는 무엇인가요?

추출 대상:

- 직무 흥미
- 몰입 조건
- 문제 해결 방식
- 실제 경험 기반 강점

### Career 02

일할 때 가장 중요하게 생각하는 기준은 무엇인가요?

추출 대상:

- 직업 가치관
- 조직 선호
- 성장 기준
- 의사결정 기준

### Career 03

다른 사람보다 비교적 자연스럽게 잘하는 일은 무엇인가요?

추출 대상:

- 강점
- 역량
- 협업 방식
- 문제 접근 방식

### Career 04

앞으로 커리어에서 꼭 다뤄보고 싶은 문제나 분야가 있나요?

추출 대상:

- 관심 도메인
- 기술 관심사
- 장기 커리어 방향
- 해결하고 싶은 문제

---

## 7. 심층 질문 생성 설계

## 7.1 심층 질문의 목적

심층 질문은 사용자의 답변을 더 길게 만들기 위한 기능이 아니라, 답변 속에 숨어 있는 판단 기준과 반복 패턴을 드러내기 위한 기능이다.

AI는 사용자의 답변을 보고 다음 중 부족한 부분을 찾아 질문해야 한다.

- 구체적 경험
- 당시 감정
- 선택 이유
- 행동 방식
- 결과와 배운 점
- 반복되는 패턴
- 가치 충돌
- 커리어와의 연결

---

## 7.2 심층 질문 카테고리

AI는 후속 질문을 생성할 때 질문 의도를 함께 태깅한다.

| 카테고리 | 목적 | 질문 예시 |
|---|---|---|
| concrete_example | 구체적 사례 확보 | 그 생각이 강하게 들었던 실제 장면이 있나요? |
| emotion | 감정 확인 | 그때 가장 크게 느낀 감정은 무엇이었나요? |
| reason | 이유 파악 | 왜 그 기준이 중요하다고 느꼈나요? |
| behavior | 행동 패턴 파악 | 그 상황에서 당신은 보통 어떻게 행동하나요? |
| conflict | 가치 충돌 확인 | 그 선택에서 포기해야 했던 것은 무엇이었나요? |
| change | 변화 추적 | 그 경험 이후 생각이나 행동이 어떻게 바뀌었나요? |
| career_link | 커리어 연결 | 이 경험이 앞으로의 일 선택에 어떤 영향을 줄 것 같나요? |
| identity | 정체성 언어화 | 이 답변이 당신을 어떤 사람이라고 설명한다고 보나요? |

---

## 7.3 심층 질문 생성 규칙

AI는 한 번에 2~4개의 심층 질문을 제시한다.

생성 규칙:

- 사용자가 이미 답한 내용을 반복해서 묻지 않는다.
- 하나의 질문에는 하나의 의도만 담는다.
- 질문은 짧고 구체적으로 작성한다.
- 사용자를 평가하거나 단정하지 않는다.
- 답변을 유도하되 특정 방향으로 몰아가지 않는다.
- 질문마다 `intent`와 `reason`을 함께 반환한다.
- 서로 다른 관점의 질문을 섞는다.

나쁜 질문:

```text
그러면 당신은 성장지향적인 사람인 것 같은데, 맞나요?
```

좋은 질문:

```text
그 선택을 했을 때 포기해야 했던 것은 무엇이었나요?
```

---

## 7.4 심층 질문 예시

사용자 답변:

```text
저는 새로운 환경에 들어가서 처음에는 힘들어도 적응해가면서 성장하는 과정이 좋았던 것 같아요.
```

AI가 생성할 심층 질문:

```json
[
  {
    "id": "fq_01",
    "question": "새로운 환경에 적응하면서 스스로 성장했다고 느꼈던 구체적인 장면이 있나요?",
    "intent": "concrete_example",
    "reason": "성장이라는 추상적 가치를 실제 경험으로 연결하기 위해"
  },
  {
    "id": "fq_02",
    "question": "처음 힘들었던 시기에도 계속 버틸 수 있었던 기준이나 이유는 무엇이었나요?",
    "intent": "reason",
    "reason": "어려운 상황에서 작동하는 선택 기준을 파악하기 위해"
  },
  {
    "id": "fq_03",
    "question": "그 경험 이후 새로운 환경을 대하는 태도가 어떻게 달라졌나요?",
    "intent": "change",
    "reason": "경험 전후의 변화와 학습 패턴을 확인하기 위해"
  }
]
```

---

## 8. 답변 구조화 설계

## 8.1 구조화의 목적

수집된 답변은 단순 텍스트 배열로 저장하면 분석하기 어렵다. 각 답변에서 의미 단위를 추출하고, 어떤 질문에서 어떤 맥락으로 나온 답변인지 함께 저장해야 한다.

AI는 각 답변에서 다음 정보를 추출한다.

- 핵심 키워드
- 가치
- 감정
- 경험
- 강점
- 행동 패턴
- 선택 기준
- 회피 요소
- 커리어 관심사
- 근거 문장
- 확신도

---

## 8.2 답변 단위 분석 결과

각 답변은 다음과 같이 구조화한다.

```json
{
  "answerId": "a_003",
  "questionId": "fq_02",
  "coreQuestionId": "life_01",
  "depth": 2,
  "answerText": "처음에는 불안했지만, 내가 선택한 일이니까 끝까지 해보고 싶다는 생각이 컸어요.",
  "extractedSignals": [
    {
      "label": "책임감",
      "type": "value",
      "confidence": 0.82,
      "evidence": "내가 선택한 일이니까 끝까지 해보고 싶다는 생각"
    },
    {
      "label": "불안 속에서도 지속하는 태도",
      "type": "strength",
      "confidence": 0.76,
      "evidence": "처음에는 불안했지만"
    }
  ],
  "rawKeywords": ["불안", "선택", "끝까지", "책임"],
  "summary": "사용자는 자신이 선택한 일에 대해 책임감을 느끼고, 불안이 있어도 지속하려는 경향을 보인다."
}
```

---

## 9. 유사 요소 병합 및 가중치 계산

## 9.1 핵심 원칙

최종 분석에서는 모든 답변을 동일하게 취급하지 않는다. 여러 답변에서 반복적으로 등장하거나 서로 다른 질문 맥락에서 재등장한 요소는 사용자에게 더 중요한 특성으로 본다.

예를 들어 “성장”, “배움”, “새로운 환경에서 적응”, “더 나아지고 싶음”이 여러 답변에서 반복되면 하나의 상위 노드인 **성장 지향성**으로 병합하고 높은 가중치를 부여한다.

---

## 9.2 병합 기준

AI는 다음 기준으로 유사 요소를 병합한다.

| 병합 기준 | 예시 |
|---|---|
| 같은 단어 반복 | 성장, 성장하고 싶다, 성장 과정 |
| 의미 유사성 | 배움, 학습, 발전, 더 나아짐 |
| 같은 경험에서 파생 | 프로젝트 리딩, 팀 조율, 일정 관리 |
| 같은 선택 기준 | 자율성, 스스로 결정, 주도권 |
| 같은 감정 패턴 | 답답함, 통제받는 느낌, 제한됨 |
| 같은 커리어 방향 | AI 서비스, 데이터 기반 서비스, 기술과 사용자 연결 |

---

## 9.3 가중치 계산 방식

해커톤 MVP에서는 복잡한 알고리즘보다 설명 가능한 점수식을 사용한다.

### 추천 점수식

```text
node_weight =
  0.35 * frequency_score
+ 0.25 * context_diversity_score
+ 0.20 * confidence_score
+ 0.10 * depth_score
+ 0.10 * explicitness_score
```

### 점수 요소 정의

| 요소 | 의미 |
|---|---|
| frequency_score | 전체 답변에서 해당 요소가 반복 등장한 정도 |
| context_diversity_score | 서로 다른 코어 질문에서 등장한 정도 |
| confidence_score | AI가 해당 요소를 추출한 평균 확신도 |
| depth_score | 심층 질문 단계에서 나온 답변일수록 부여되는 보정값 |
| explicitness_score | 사용자가 직접 언급했는지, AI가 추론했는지의 차이 |

### 점수 해석

| weight | 의미 |
|---|---|
| 0.80 이상 | 사용자를 강하게 정의하는 핵심 특성 |
| 0.60~0.79 | 비교적 일관되게 드러나는 중요 특성 |
| 0.40~0.59 | 보조적 특성 |
| 0.40 미만 | 결과 화면에서는 숨기거나 낮은 우선순위로 표시 |

---

## 9.4 반복 답변 가중치 반영 예시

수집된 신호:

```text
답변 1: 새로운 환경에서 배우는 것이 좋다 → 성장
답변 2: 프로젝트를 하며 몰랐던 기술을 익히는 과정이 좋다 → 학습
답변 3: 익숙한 일만 반복하면 답답하다 → 성장 없는 환경 회피
답변 4: 커리어에서 계속 확장하고 싶다 → 성장 지향
```

병합 결과:

```json
{
  "label": "성장 지향성",
  "type": "value",
  "weight": 0.91,
  "mergedFrom": ["성장", "학습", "확장", "성장 없는 환경 회피"],
  "frequency": 4,
  "contextDiversity": 3,
  "evidence": [
    "새로운 환경에서 배우는 것이 좋다",
    "몰랐던 기술을 익히는 과정이 좋다",
    "익숙한 일만 반복하면 답답하다",
    "커리어에서 계속 확장하고 싶다"
  ]
}
```

---

## 10. 그래프 설계

## 10.1 노드 타입

| 타입 | 설명 | 예시 |
|---|---|---|
| value | 삶과 일에서 중요하게 여기는 가치 | 성장, 자유, 안정, 의미 |
| strength | 반복적으로 드러나는 강점 | 구조화, 실행력, 공감, 분석력 |
| experience | 중요한 경험 | 프로젝트 리딩, 여행, 봉사, 인턴십 |
| emotion | 자주 등장하는 감정 패턴 | 몰입, 답답함, 불안, 성취감 |
| blocker | 사용자를 막는 요소 | 지나친 통제, 성장 없는 환경 |
| career | 커리어 방향 | AI 서비스, 제품 개발, 데이터 분석 |
| identity | 사용자를 정의하는 상위 정체성 | 문제를 구조화하는 사람 |

---

## 10.2 엣지 타입

| 타입 | 의미 | 예시 |
|---|---|---|
| supports | 한 요소가 다른 요소를 강화 | 성장 → 학습력 |
| causes | 어떤 요소가 행동을 유발 | 답답함 → 환경 전환 욕구 |
| conflicts_with | 두 요소가 충돌 | 안정 욕구 ↔ 도전 욕구 |
| expresses | 경험이 가치나 강점을 드러냄 | 프로젝트 리딩 → 책임감 |
| leads_to | 가치나 경험이 방향성으로 이어짐 | 사용자 문제 관심 → AI 서비스 개발 |
| similar_to | 의미가 유사하거나 병합 가능 | 성장 ↔ 배움 |
| reinforces | 여러 답변에서 반복되어 강화 | 반복된 성장 언급 → 성장 지향성 |

---

## 10.3 그래프 생성 원칙

- 최종 그래프에는 weight가 높은 노드를 우선 표시한다.
- 중심 노드는 weight가 가장 높은 value 또는 identity 노드로 둔다.
- 같은 코어 질문에서만 나온 요소보다 여러 코어 질문에서 반복된 요소를 더 크게 표시한다.
- evidence가 없는 추론 노드는 만들지 않는다.
- 유사 의미 노드는 개별 노드로 과도하게 흩뜨리지 말고 상위 노드로 병합한다.
- 사용자가 클릭하면 해당 노드가 어떤 답변에서 도출됐는지 보여준다.

---

## 11. 결과 생성 설계

## 11.1 결과 화면 구성

```text
상단:
  나를 표현하는 한 문장

중단:
  핵심 그래프

하단:
  핵심 가치 / 강점 / 반복 패턴 / 커리어 방향 / 보완점 카드

세부:
  각 노드별 근거 답변 보기
```

---

## 11.2 나를 표현하는 한 문장 생성 조건

한 문장은 감성적 문구가 아니라 답변 기반의 요약이어야 한다.

좋은 문장의 조건:

- weight가 높은 핵심 가치가 포함되어야 한다.
- weight가 높은 강점 또는 행동 방식이 포함되어야 한다.
- 커리어 또는 삶의 방향성이 드러나야 한다.
- 답변에 없는 내용을 과장해서 만들면 안 된다.
- 자기소개서나 포트폴리오 첫 문장으로 활용 가능해야 한다.

기본 공식:

```text
나는 [핵심 가치]를 바탕으로 [강점/행동 방식]을 통해 [문제/대상]을 [방향성]으로 바꾸는 사람입니다.
```

예시:

```text
나는 낯선 환경에서도 배움을 찾아내고, 복잡한 경험을 구조화해 실질적인 변화로 연결하는 사람입니다.
```

---

## 12. 화면 구성

## 12.1 페이지 구조

```text
/
  랜딩 페이지

/interview
  심층 인터뷰 페이지

/analyzing
  AI 분석 대기 페이지

/result
  결과 페이지
```

---

## 12.2 인터뷰 페이지 UI

### 구성 요소

- 현재 코어 질문 번호
- 현재 코어 질문 제목
- 현재 depth 표시
- 답변 입력창
- 생성된 심층 질문 카드 목록
- 질문별 답변 버튼
- 추가로 더 파고들기 버튼
- 이 코어 질문 마무리 버튼
- 다음 코어 질문으로 이동 버튼
- 전체 분석하기 버튼
- 현재까지 수집된 답변 개수

### 화면 상태

```text
state: core_question_answering
  코어 질문에 대한 첫 답변을 입력하는 상태

state: followup_generating
  AI가 심층 질문을 생성하는 상태

state: followup_selecting
  생성된 심층 질문 중 답변할 질문을 선택하는 상태

state: followup_answering
  선택한 심층 질문에 답변하는 상태

state: thread_closing
  현재 코어 질문 스레드를 요약하고 종료하는 상태

state: ready_to_analyze
  전체 분석을 실행할 수 있는 상태
```

---

## 12.3 인터뷰 화면 UX 예시

```text
[인생관 1/4] 최근 몇 년 동안 가장 크게 변했다고 느끼는 부분은 무엇인가요?

답변 입력창

[답변 저장하고 심층 질문 받기]
```

답변 후:

```text
AI가 더 깊게 생각해볼 질문을 만들었습니다.

1. 그 변화가 시작된 구체적인 계기는 무엇이었나요?
2. 변화 전의 나와 지금의 나는 무엇을 다르게 선택하나요?
3. 그 변화가 커리어 선택에도 영향을 주고 있나요?

[1번에 답변하기] [2번에 답변하기] [3번에 답변하기]

[이 질문은 여기까지] [다음 코어 질문으로]
```

---

## 13. 데이터 구조 설계

## 13.1 TypeScript 타입

```ts
type QuestionCategory = "life" | "career";

type QuestionIntent =
  | "concrete_example"
  | "emotion"
  | "reason"
  | "behavior"
  | "conflict"
  | "change"
  | "career_link"
  | "identity";

type CoreQuestion = {
  id: string;
  category: QuestionCategory;
  title: string;
  description?: string;
  placeholder: string;
  order: number;
};

type InterviewQuestion = {
  id: string;
  coreQuestionId: string;
  parentAnswerId?: string;
  type: "core" | "followup";
  depth: number;
  title: string;
  intent?: QuestionIntent;
  reason?: string;
};

type InterviewAnswer = {
  id: string;
  questionId: string;
  coreQuestionId: string;
  parentAnswerId?: string;
  depth: number;
  answerText: string;
  createdAt: string;
};

type QuestionThread = {
  coreQuestionId: string;
  status: "active" | "closed" | "skipped";
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  summary?: string;
};

type ExtractedSignalType =
  | "value"
  | "strength"
  | "experience"
  | "emotion"
  | "blocker"
  | "career"
  | "identity";

type ExtractedSignal = {
  id: string;
  label: string;
  normalizedLabel: string;
  type: ExtractedSignalType;
  confidence: number;
  evidence: string;
  sourceAnswerId: string;
  coreQuestionId: string;
  depth: number;
  explicitness: "explicit" | "inferred";
};

type MergedSignal = {
  id: string;
  label: string;
  type: ExtractedSignalType;
  weight: number;
  frequency: number;
  contextDiversity: number;
  averageConfidence: number;
  mergedFrom: string[];
  evidence: string[];
  sourceAnswerIds: string[];
};

type GraphNode = {
  id: string;
  label: string;
  type: ExtractedSignalType;
  weight: number;
  evidence: string[];
};

type GraphEdgeType =
  | "supports"
  | "causes"
  | "conflicts_with"
  | "expresses"
  | "leads_to"
  | "similar_to"
  | "reinforces";

type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  weight: number;
  label: string;
  evidence: string[];
};

type AnalysisResult = {
  oneLineIdentity: string;
  summary: string;
  coreValues: MergedSignal[];
  strengths: MergedSignal[];
  careerDirection: {
    summary: string;
    keywords: string[];
    evidence: string[];
  };
  riskPatterns: {
    label: string;
    recommendation: string;
    evidence: string[];
  }[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
};
```

---

## 14. AI 프롬프트 설계

## 14.1 심층 질문 생성 프롬프트

```text
당신은 사용자의 자기성찰을 돕는 인터뷰어입니다.

목표는 사용자의 답변을 평가하는 것이 아니라, 답변 속에 숨어 있는 구체적 경험, 감정, 선택 기준, 가치관, 커리어 방향성을 더 잘 드러내는 것입니다.

아래 정보를 바탕으로 심층 질문 2~4개를 생성하세요.

조건:
- 질문은 각각 하나의 의도만 가져야 합니다.
- 사용자가 이미 답한 내용을 반복해서 묻지 마세요.
- 질문은 짧고 구체적이어야 합니다.
- 사용자를 단정하거나 평가하지 마세요.
- 질문 의도는 다음 중 하나로 분류하세요:
  concrete_example, emotion, reason, behavior, conflict, change, career_link, identity
- 각 질문마다 왜 이 질문이 필요한지 reason을 작성하세요.
- 반드시 JSON 배열만 반환하세요.

코어 질문:
{{coreQuestion}}

현재 질문:
{{currentQuestion}}

사용자 답변:
{{answer}}

이전 질문과 답변 요약:
{{threadSummary}}

반환 형식:
[
  {
    "question": "...",
    "intent": "concrete_example | emotion | reason | behavior | conflict | change | career_link | identity",
    "reason": "..."
  }
]
```

---

## 14.2 답변 단위 구조화 프롬프트

```text
당신은 사용자의 인터뷰 답변을 분석하는 구조화 엔진입니다.

아래 답변에서 의미 있는 신호를 추출하세요.

추출 대상:
- value: 사용자가 중요하게 여기는 가치
- strength: 강점 또는 반복 행동 방식
- experience: 중요한 경험
- emotion: 감정 패턴
- blocker: 불편함, 회피 요소, 제약 조건
- career: 커리어 관심사 또는 방향
- identity: 사용자를 설명하는 정체성 표현

조건:
- 답변에 근거가 있는 정보만 추출하세요.
- 추론한 경우 explicitness를 inferred로 표시하세요.
- 사용자가 직접 말한 경우 explicitness를 explicit으로 표시하세요.
- evidence에는 답변 속 근거 문장을 짧게 넣으세요.
- confidence는 0~1 사이 숫자로 작성하세요.
- 반드시 JSON만 반환하세요.

질문:
{{question}}

답변:
{{answer}}

반환 형식:
{
  "answerSummary": "...",
  "signals": [
    {
      "label": "...",
      "normalizedLabel": "...",
      "type": "value | strength | experience | emotion | blocker | career | identity",
      "confidence": 0.0,
      "evidence": "...",
      "explicitness": "explicit | inferred"
    }
  ]
}
```

---

## 14.3 전체 분석 프롬프트

```text
당신은 사용자의 전체 인터뷰 답변을 바탕으로 인생관과 커리어 정체성을 분석하는 AI입니다.

입력으로 여러 코어 질문 스레드, 각 답변에서 추출된 신호, 답변 간 연결 정보를 받습니다.

해야 할 일:
1. 유사한 신호를 병합하세요.
2. 반복적으로 등장하는 요소에 높은 가중치를 부여하세요.
3. 서로 다른 코어 질문에서 반복된 요소는 더 중요하게 보세요.
4. 심층 질문에서 구체적 근거와 함께 나온 요소는 더 신뢰하세요.
5. 그래프 노드와 엣지를 생성하세요.
6. 사용자를 표현하는 한 문장을 생성하세요.
7. 모든 분석에는 근거 답변을 포함하세요.

가중치 기준:
- frequency_score: 반복 등장 정도
- context_diversity_score: 서로 다른 코어 질문에서 등장한 정도
- confidence_score: 추출 확신도
- depth_score: 심층 답변에서 나온 정도
- explicitness_score: 사용자가 직접 언급했는지 여부

주의:
- 답변에 없는 내용을 과장하지 마세요.
- 단순히 많이 나온 단어만 보지 말고 의미 유사성을 고려하세요.
- 유사한 표현은 상위 개념으로 병합하세요.
- 결과는 프론트엔드에서 바로 렌더링 가능한 JSON으로 반환하세요.

입력 데이터:
{{structuredInterviewData}}

반환 형식:
{
  "oneLineIdentity": "...",
  "summary": "...",
  "coreValues": [
    {
      "id": "...",
      "label": "...",
      "type": "value",
      "weight": 0.0,
      "frequency": 0,
      "contextDiversity": 0,
      "averageConfidence": 0.0,
      "mergedFrom": ["..."],
      "evidence": ["..."],
      "sourceAnswerIds": ["..."]
    }
  ],
  "strengths": [],
  "careerDirection": {
    "summary": "...",
    "keywords": ["..."],
    "evidence": ["..."]
  },
  "riskPatterns": [
    {
      "label": "...",
      "recommendation": "...",
      "evidence": ["..."]
    }
  ],
  "graph": {
    "nodes": [
      {
        "id": "...",
        "label": "...",
        "type": "value | strength | experience | emotion | blocker | career | identity",
        "weight": 0.0,
        "evidence": ["..."]
      }
    ],
    "edges": [
      {
        "id": "...",
        "source": "...",
        "target": "...",
        "type": "supports | causes | conflicts_with | expresses | leads_to | similar_to | reinforces",
        "weight": 0.0,
        "label": "...",
        "evidence": ["..."]
      }
    ]
  }
}
```

---

## 15. AI에게 개발을 맡기기 위한 문서 구조

AI에게 개발을 맡길 때는 “전체 서비스를 만들어줘”라고 요청하지 말고, 문서를 기능 단위로 분리해야 한다.

권장 구조:

```text
docs/
  00_PROJECT_OVERVIEW.md
  01_PRD.md
  02_INTERVIEW_FLOW.md
  03_SCREEN_SPEC.md
  04_DATA_SCHEMA.md
  05_AI_PROMPTS.md
  06_ANALYSIS_LOGIC.md
  07_FRONTEND_SPEC.md
  08_DESIGN_SYSTEM.md
  09_TASK_BREAKDOWN.md
  10_QA_CHECKLIST.md
```

### 00_PROJECT_OVERVIEW.md

서비스 목적, 핵심 사용자, MVP 범위, 최종 산출물을 정의한다.

### 01_PRD.md

문제 정의, 타깃 사용자, 핵심 가치, 기능 범위를 정의한다.

### 02_INTERVIEW_FLOW.md

코어 질문, 심층 질문 생성, 반복 사이클, 종료 조건, 사용자 액션을 정의한다.

### 03_SCREEN_SPEC.md

페이지별 UI, 버튼 동작, 상태 전환, 입력 검증, 로딩 상태를 정의한다.

### 04_DATA_SCHEMA.md

질문, 답변, 스레드, 추출 신호, 병합 신호, 그래프 노드·엣지 타입을 정의한다.

### 05_AI_PROMPTS.md

심층 질문 생성 프롬프트, 답변 구조화 프롬프트, 전체 분석 프롬프트를 저장한다.

### 06_ANALYSIS_LOGIC.md

유사 요소 병합 기준, 가중치 계산 방식, 노드 우선순위, 그래프 생성 규칙을 정의한다.

### 07_FRONTEND_SPEC.md

프론트엔드 기술 스택, 폴더 구조, 상태 관리 방식, mock API 구조를 정의한다.

### 08_DESIGN_SYSTEM.md

컬러, 타이포그래피, 버튼, 카드, 질문 UI, 그래프 스타일을 정의한다.

### 09_TASK_BREAKDOWN.md

AI에게 순차적으로 맡길 작업 단위를 정의한다.

### 10_QA_CHECKLIST.md

기능 검증, UX 검증, 분석 결과 검증, 예외 케이스를 정의한다.

---

## 16. AI 작업 지시 예시

### 16.1 인터뷰 상태 모델 구현 요청

```md
다음 문서를 기준으로 심층 인터뷰 상태 모델을 구현해줘.

참고 문서:
- docs/02_INTERVIEW_FLOW.md
- docs/04_DATA_SCHEMA.md

요구사항:
- CoreQuestion, InterviewQuestion, InterviewAnswer, QuestionThread 타입을 정의할 것
- 하나의 코어 질문에서 여러 개의 follow-up question이 파생될 수 있어야 함
- follow-up answer에 대해 다시 follow-up question을 생성할 수 있는 트리 구조여야 함
- 현재 활성 질문, 현재 depth, 현재 thread status를 관리할 수 있어야 함
- API 연동 없이 mock 데이터로 동작하게 만들 것

금지사항:
- 전체 앱 구조를 임의로 변경하지 말 것
- UI 디자인을 새로 만들지 말 것
- 분석 로직은 구현하지 말 것
```

---

### 16.2 심층 질문 UI 구현 요청

```md
다음 문서를 기준으로 Interview Page UI만 구현해줘.

참고 문서:
- docs/02_INTERVIEW_FLOW.md
- docs/03_SCREEN_SPEC.md
- docs/08_DESIGN_SYSTEM.md

요구사항:
- 현재 코어 질문 표시
- 답변 textarea 구현
- 답변 저장 후 심층 질문 카드 목록 표시
- 심층 질문은 2~4개 카드로 보여줄 것
- 사용자가 특정 심층 질문을 선택하면 해당 질문에 답변할 수 있어야 함
- “이 질문은 여기까지”, “다음 코어 질문으로” 버튼 구현
- 빈 답변이면 저장 버튼 비활성화

금지사항:
- 실제 AI API 호출 금지
- localStorage 저장 금지
- 라우팅 구조 변경 금지
```

---

### 16.3 분석 로직 구현 요청

```md
다음 문서를 기준으로 인터뷰 답변 분석 로직을 구현해줘.

참고 문서:
- docs/04_DATA_SCHEMA.md
- docs/06_ANALYSIS_LOGIC.md

요구사항:
- ExtractedSignal 배열을 입력받아 MergedSignal 배열을 반환하는 함수 작성
- normalizedLabel이 같거나 유사 그룹에 속한 신호를 병합
- frequency, contextDiversity, averageConfidence 계산
- weight 계산식 적용
- weight 내림차순으로 정렬
- 테스트 가능한 순수 함수로 작성

금지사항:
- AI API 호출 금지
- UI 컴포넌트 작성 금지
- 임의의 외부 라이브러리 추가 금지
```

---

## 17. 해커톤 구현 우선순위

### Phase 1. 문서와 데이터 구조 확정

- 코어 질문 확정
- 인터뷰 플로우 확정
- 타입 정의
- mock 데이터 생성

완료 기준:

- 질문·답변·스레드 구조가 코드로 표현 가능하다.

### Phase 2. 인터뷰 UI 구현

- 코어 질문 답변 UI
- 심층 질문 카드 UI
- 심층 답변 UI
- 다음 질문 이동
- 현재 질문 마무리

완료 기준:

- 사용자가 하나의 코어 질문에서 여러 단계의 심층 인터뷰를 진행할 수 있다.

### Phase 3. AI 프롬프트 연결

- 심층 질문 생성 API 연결
- 답변 단위 구조화 API 연결
- 전체 분석 API 연결

완료 기준:

- 사용자의 답변에 따라 다른 심층 질문이 생성된다.

### Phase 4. 분석 및 그래프 생성

- 유사 신호 병합
- 가중치 계산
- 그래프 노드·엣지 생성
- 결과 JSON 생성

완료 기준:

- 반복적으로 등장한 가치와 강점이 높은 weight로 표시된다.

### Phase 5. 결과 화면 구현

- 한 문장 자기정의 표시
- 그래프 시각화
- 핵심 가치 카드
- 강점 카드
- 커리어 방향 카드
- 근거 답변 보기

완료 기준:

- 사용자가 자신의 반복 패턴과 정체성 문장을 확인할 수 있다.

---

## 18. QA 체크리스트

### 인터뷰 플로우

- [ ] 코어 질문에 답변할 수 있다.
- [ ] 답변 후 심층 질문이 2~4개 생성된다.
- [ ] 심층 질문 중 하나를 선택해 답변할 수 있다.
- [ ] 심층 답변에 대해 다시 꼬리질문을 생성할 수 있다.
- [ ] 사용자가 현재 코어 질문을 마무리할 수 있다.
- [ ] 사용자가 다음 코어 질문으로 넘어갈 수 있다.
- [ ] 사용자가 충분한 답변 후 전체 분석을 실행할 수 있다.

### 분석 품질

- [ ] 유사한 표현이 하나의 상위 개념으로 병합된다.
- [ ] 반복적으로 등장한 요소의 weight가 높다.
- [ ] 서로 다른 코어 질문에서 등장한 요소가 더 중요하게 반영된다.
- [ ] 각 노드에는 근거 답변이 포함된다.
- [ ] 답변에 없는 내용이 결과에 과장되어 포함되지 않는다.

### 결과 화면

- [ ] 나를 표현하는 한 문장이 표시된다.
- [ ] 그래프 노드 크기가 weight에 따라 달라진다.
- [ ] 노드를 클릭하면 근거 답변을 볼 수 있다.
- [ ] 핵심 가치, 강점, 커리어 방향이 구분되어 보인다.
- [ ] 보완점은 단정적 표현이 아니라 제안 형태로 표시된다.

---

## 19. 핵심 결론

수정된 서비스의 핵심은 고정 질문에 답변하는 것이 아니라, **하나의 답변을 출발점으로 사용자의 생각을 점점 깊게 파고드는 인터뷰 사이클**이다.

제품의 차별점은 다음 세 가지다.

1. 답변 기반 심층 질문으로 자기성찰의 깊이를 만든다.
2. 모든 답변을 구조화하고 유사 요소를 병합한다.
3. 반복적으로 등장한 요소에 높은 가중치를 부여해 사용자를 정의한다.

따라서 MVP 개발에서 가장 중요한 것은 화려한 그래프가 아니라 다음 구조를 안정적으로 만드는 것이다.

```text
코어 질문
→ 답변
→ 심층 질문 여러 개
→ 선택 답변
→ 추가 꼬리질문
→ 스레드 종료
→ 전체 답변 구조화
→ 유사 요소 병합
→ 가중치 기반 자기정의
```

이 구조가 명확하면, 이후 AI에게 UI 구현, 분석 로직 구현, 프롬프트 개선, 그래프 시각화 작업을 단계별로 맡길 수 있다.

---

## 17. 확정 구현 설정: React 기반 모바일 뷰 웹사이트

이 서비스의 최종 결과물은 **React 기반 모바일 우선 웹사이트**로 구현한다. 데스크톱 대응은 필수 범위가 아니며, 해커톤 MVP에서는 모바일 화면에서 인터뷰를 진행하고 결과 그래프를 확인하는 경험을 우선한다.

### 17.1 결과물 형식

| 항목 | 설정 |
|---|---|
| 결과물 유형 | 모바일 뷰 웹사이트 |
| 주 사용 환경 | 모바일 브라우저 |
| 개발 기준 화면 | 375px ~ 430px width |
| 데스크톱 대응 | 선택 사항. 중앙 정렬된 모바일 프레임 형태로 표시 |
| 핵심 화면 | 랜딩, 인터뷰, 심층 질문, 분석 로딩, 결과 |
| 핵심 산출물 | 나를 표현하는 한 문장, 그래프, 요약 카드, 근거 답변 |

모바일 기준 UI 원칙은 다음과 같다.

- 한 화면에 하나의 주요 행동만 배치한다.
- 질문은 카드 형태로 표시한다.
- 답변 입력 영역은 충분히 크게 제공한다.
- 심층 질문은 2~4개 카드로 표시하고, 사용자가 선택해 답변할 수 있게 한다.
- 그래프는 모바일에서 과도하게 복잡하지 않도록 상위 weight 노드 중심으로 먼저 보여준다.
- 상세 근거 답변은 하단 카드 또는 바텀시트 형태로 제공한다.

---

## 18. 확정 기술스택

### 18.1 기본 기술스택

| 영역 | 기술 | 선택 이유 |
|---|---|---|
| Framework | Next.js | React 기반이며 API Route를 통해 AI API Key를 서버 측에서 안전하게 처리 가능 |
| Language | TypeScript | 인터뷰 상태, 분석 결과, 그래프 스키마를 안정적으로 관리하기 위함 |
| Styling | Tailwind CSS | 모바일 UI를 빠르게 구성하고 일관된 디자인 시스템 적용 가능 |
| State Management | Zustand | 심층 인터뷰의 트리형 상태를 전역에서 단순하게 관리 가능 |
| AI API | OpenAI API | 심층 질문 생성, 답변 구조화, 최종 분석 생성에 사용 |
| Graph Visualization | React Flow | 노드·엣지 기반 그래프 UI를 빠르게 구현 가능 |
| Deployment | Vercel | Next.js 배포에 최적화되어 있고 해커톤 MVP 배포 속도가 빠름 |
| Storage | localStorage | 로그인 없는 MVP에서 인터뷰 진행 상태와 결과를 임시 저장하기 위함 |
| Package Manager | npm | 기본 환경 호환성이 높고 AI 코드 생성 시 오류 가능성이 낮음 |

### 18.2 선택하지 않는 항목

MVP에서는 다음 기술은 사용하지 않는다.

| 항목 | 제외 이유 |
|---|---|
| 별도 백엔드 서버 | 해커톤 범위에서 구현 비용이 크다. Next.js API Route로 대체한다. |
| DB | 로그인과 장기 저장을 제외하므로 필수 아님. |
| Supabase/Firebase | 확장 가능성은 있으나 MVP에서는 localStorage로 충분하다. |
| 복잡한 인증 | 사용자 계정 기능이 MVP 범위가 아니다. |
| PDF 생성 | 결과 공유 기능은 후순위다. |

### 18.3 권장 프로젝트 구조

```text
src/
  app/
    page.tsx
    interview/
      page.tsx
    result/
      page.tsx
    api/
      generate-followups/
        route.ts
      structure-answer/
        route.ts
      analyze-result/
        route.ts
  components/
    common/
    interview/
    result/
    graph/
  constants/
    coreQuestions.ts
  lib/
    ai/
      prompts.ts
      openaiClient.ts
    analysis/
      mergeSignals.ts
      calculateWeight.ts
      buildGraph.ts
    storage/
      interviewStorage.ts
  store/
    interviewStore.ts
  types/
    interview.ts
    analysis.ts
    graph.ts
    result.ts
```

### 18.4 라우팅 구조

| 경로 | 화면 | 설명 |
|---|---|---|
| `/` | Landing Page | 서비스 소개, 시작 버튼 |
| `/interview` | Interview Page | 코어 질문, 답변 입력, 심층 질문 반복 |
| `/result` | Result Page | 한 문장 정체성, 그래프, 요약 카드, 근거 답변 |

### 18.5 API Route 구조

AI API Key는 클라이언트에 노출하지 않는다. 모든 AI 호출은 Next.js API Route에서 처리한다.

| API Route | 역할 |
|---|---|
| `POST /api/generate-followups` | 사용자의 답변을 바탕으로 심층 질문 2~4개 생성 |
| `POST /api/structure-answer` | 단일 답변에서 의미 신호 추출 |
| `POST /api/analyze-result` | 전체 인터뷰 데이터를 병합·분석하여 최종 결과 생성 |

### 18.6 환경변수

```env
OPENAI_API_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

주의사항:

- `OPENAI_API_KEY`는 절대 `NEXT_PUBLIC_` prefix를 붙이지 않는다.
- 클라이언트 컴포넌트에서 OpenAI API를 직접 호출하지 않는다.
- AI 응답은 반드시 JSON 파싱 검증을 거친다.

---

## 19. 배포 설정

### 19.1 배포 플랫폼

배포 플랫폼은 **Vercel**로 확정한다.

### 19.2 배포 기준

| 항목 | 설정 |
|---|---|
| Platform | Vercel |
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Output | Next.js default |
| Production Branch | `main` |

### 19.3 배포 전 체크리스트

- `.env.local`에 `OPENAI_API_KEY`가 설정되어 있는지 확인한다.
- Vercel Project Environment Variables에도 `OPENAI_API_KEY`를 등록한다.
- `/api/generate-followups`, `/api/structure-answer`, `/api/analyze-result`가 정상 응답하는지 확인한다.
- 모바일 화면 375px 기준에서 인터뷰 진행이 가능한지 확인한다.
- 결과 그래프가 화면 밖으로 과도하게 넘치지 않는지 확인한다.
- AI 응답이 JSON 파싱에 실패했을 때 fallback UI가 표시되는지 확인한다.

---

## 20. 확정 데이터 스키마

이 섹션은 프론트엔드, AI API Route, 분석 로직이 공통으로 따라야 하는 기준이다. AI에게 개발을 맡길 때 이 스키마를 우선 기준으로 사용한다.

### 20.1 CoreQuestion

```ts
type CoreQuestionCategory = "life" | "career";

type CoreQuestion = {
  id: string;
  category: CoreQuestionCategory;
  title: string;
  description?: string;
  order: number;
};
```

예시:

```json
{
  "id": "core_life_001",
  "category": "life",
  "title": "당신이 삶에서 가장 중요하게 지키고 싶은 기준은 무엇인가요?",
  "description": "정답보다 본인의 실제 경험과 선택 기준을 중심으로 답변하세요.",
  "order": 1
}
```

### 20.2 InterviewQuestion

```ts
type InterviewQuestionType = "core" | "follow_up";

type FollowUpIntent =
  | "concrete_example"
  | "emotion"
  | "reason"
  | "behavior"
  | "conflict"
  | "change"
  | "career_link"
  | "identity";

type InterviewQuestion = {
  id: string;
  coreQuestionId: string;
  parentQuestionId?: string;
  parentAnswerId?: string;
  type: InterviewQuestionType;
  depth: number;
  text: string;
  intent?: FollowUpIntent;
  reason?: string;
  createdAt: string;
};
```

규칙:

- 코어 질문의 `depth`는 0이다.
- 코어 질문에서 파생된 첫 심층 질문의 `depth`는 1이다.
- 심층 답변에서 다시 생성된 질문은 `depth + 1`로 계산한다.
- `parentQuestionId`와 `parentAnswerId`를 통해 질문 트리 관계를 추적한다.

### 20.3 InterviewAnswer

```ts
type InterviewAnswer = {
  id: string;
  questionId: string;
  coreQuestionId: string;
  parentAnswerId?: string;
  text: string;
  depth: number;
  createdAt: string;
  structured?: StructuredAnswer;
};
```

### 20.4 QuestionThread

```ts
type QuestionThreadStatus = "active" | "closed" | "skipped";

type QuestionThread = {
  id: string;
  coreQuestionId: string;
  status: QuestionThreadStatus;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  summary?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
};
```

### 20.5 InterviewSession

```ts
type InterviewSessionStatus = "not_started" | "in_progress" | "analyzing" | "completed";

type InterviewSession = {
  id: string;
  status: InterviewSessionStatus;
  currentCoreQuestionId?: string;
  threads: QuestionThread[];
  result?: AnalysisResult;
  createdAt: string;
  updatedAt: string;
};
```

### 20.6 ExtractedSignal

```ts
type SignalType =
  | "value"
  | "strength"
  | "experience"
  | "emotion"
  | "blocker"
  | "career"
  | "identity";

type Explicitness = "explicit" | "inferred";

type ExtractedSignal = {
  id: string;
  answerId: string;
  questionId: string;
  coreQuestionId: string;
  label: string;
  normalizedLabel: string;
  type: SignalType;
  confidence: number;
  evidence: string;
  explicitness: Explicitness;
  depth: number;
};
```

### 20.7 StructuredAnswer

```ts
type StructuredAnswer = {
  answerId: string;
  answerSummary: string;
  signals: ExtractedSignal[];
};
```

### 20.8 MergedSignal

```ts
type MergedSignal = {
  id: string;
  label: string;
  type: SignalType;
  weight: number;
  frequency: number;
  contextDiversity: number;
  averageConfidence: number;
  depthScore: number;
  explicitnessScore: number;
  mergedFrom: string[];
  evidence: string[];
  sourceAnswerIds: string[];
  sourceCoreQuestionIds: string[];
};
```

가중치 계산식:

```ts
weight =
  0.35 * frequencyScore +
  0.25 * contextDiversityScore +
  0.20 * confidenceScore +
  0.10 * depthScore +
  0.10 * explicitnessScore;
```

### 20.9 GraphNode

```ts
type GraphNode = {
  id: string;
  label: string;
  type: SignalType;
  weight: number;
  description?: string;
  evidence: string[];
  sourceAnswerIds: string[];
};
```

### 20.10 GraphEdge

```ts
type GraphEdgeType =
  | "supports"
  | "causes"
  | "conflicts_with"
  | "expresses"
  | "leads_to"
  | "similar_to"
  | "reinforces";

type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  weight: number;
  label: string;
  evidence: string[];
};
```

### 20.11 AnalysisResult

```ts
type ResultCardType = "core_value" | "strength" | "career" | "pattern" | "blocker";

type ResultCard = {
  id: string;
  type: ResultCardType;
  title: string;
  description: string;
  weight: number;
  evidence: string[];
  sourceAnswerIds: string[];
};

type AnalysisResult = {
  sessionId: string;
  oneLineIdentity: string;
  summary: string;
  coreValues: MergedSignal[];
  strengths: MergedSignal[];
  careerDirection: {
    summary: string;
    keywords: string[];
    evidence: string[];
    sourceAnswerIds: string[];
  };
  riskPatterns: {
    id: string;
    label: string;
    recommendation: string;
    evidence: string[];
    sourceAnswerIds: string[];
  }[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  cards: ResultCard[];
  createdAt: string;
};
```

### 20.12 최종 결과 JSON 예시

```json
{
  "sessionId": "session_001",
  "oneLineIdentity": "나는 낯선 경험 속에서도 의미 있는 패턴을 찾아내고, 그것을 실질적인 성장으로 연결하려는 사람입니다.",
  "summary": "사용자는 성장, 자율성, 의미 있는 문제 해결을 반복적으로 언급했습니다. 특히 새로운 환경에서 배우고 이를 실제 결과물로 구조화하는 경향이 강하게 나타났습니다.",
  "coreValues": [
    {
      "id": "merged_value_001",
      "label": "성장 지향성",
      "type": "value",
      "weight": 0.91,
      "frequency": 5,
      "contextDiversity": 3,
      "averageConfidence": 0.88,
      "depthScore": 0.8,
      "explicitnessScore": 0.9,
      "mergedFrom": ["성장", "배움", "확장"],
      "evidence": [
        "새로운 환경에서 배우는 과정이 좋다",
        "익숙한 일만 반복하면 답답하다"
      ],
      "sourceAnswerIds": ["answer_001", "answer_004"],
      "sourceCoreQuestionIds": ["core_life_001", "core_career_002"]
    }
  ],
  "strengths": [],
  "careerDirection": {
    "summary": "사용자는 AI 서비스, 제품 개발, 데이터 기반 문제 해결에 관심이 있습니다.",
    "keywords": ["AI 서비스", "제품 개발", "데이터 기반 문제 해결"],
    "evidence": ["기술을 실제 서비스에 연결하고 싶다"],
    "sourceAnswerIds": ["answer_008"]
  },
  "riskPatterns": [
    {
      "id": "risk_001",
      "label": "반복적이고 성장이 적은 환경에서 동기 저하",
      "recommendation": "역할 선택 시 학습 곡선과 문제 해결 범위를 확인하는 것이 좋습니다.",
      "evidence": ["익숙한 일만 반복하면 답답하다"],
      "sourceAnswerIds": ["answer_004"]
    }
  ],
  "graph": {
    "nodes": [
      {
        "id": "node_001",
        "label": "성장 지향성",
        "type": "value",
        "weight": 0.91,
        "description": "새로운 환경과 배움을 통해 자신을 확장하려는 경향",
        "evidence": ["새로운 환경에서 배우는 과정이 좋다"],
        "sourceAnswerIds": ["answer_001", "answer_004"]
      }
    ],
    "edges": [
      {
        "id": "edge_001",
        "source": "node_001",
        "target": "node_002",
        "type": "supports",
        "weight": 0.82,
        "label": "성장 지향성이 AI 서비스 개발 관심을 강화함",
        "evidence": ["기술을 실제 서비스에 연결하고 싶다"]
      }
    ]
  },
  "cards": [
    {
      "id": "card_001",
      "type": "core_value",
      "title": "성장 지향성",
      "description": "여러 답변에서 새로운 환경, 배움, 확장에 대한 언급이 반복적으로 나타났습니다.",
      "weight": 0.91,
      "evidence": ["새로운 환경에서 배우는 과정이 좋다"],
      "sourceAnswerIds": ["answer_001", "answer_004"]
    }
  ],
  "createdAt": "2026-05-30T00:00:00.000Z"
}
```

---

## 21. AI 개발 지시 시 고정 조건

AI에게 이후 구현을 맡길 때 다음 조건을 항상 포함한다.

```md
결과물은 React 기반 모바일 뷰 웹사이트입니다.
Next.js + TypeScript + Tailwind CSS + Zustand + React Flow를 사용하세요.
배포는 Vercel 기준입니다.
AI 호출은 Next.js API Route에서 처리하고, 클라이언트에서 OpenAI API Key를 직접 사용하지 마세요.
인터뷰 상태는 QuestionThread 기반 트리 구조로 관리하세요.
최종 결과는 AnalysisResult 스키마를 반드시 따르세요.
모바일 기준 화면 폭은 375px~430px입니다.
데스크톱에서는 모바일 프레임을 중앙 정렬해 보여주세요.
```

### 21.1 첫 번째 구현 지시 예시

```md
다음 문서를 기준으로 모바일 우선 React 웹사이트의 기본 앱 구조를 구현해줘.

기술스택:
- Next.js
- TypeScript
- Tailwind CSS
- Zustand
- React Flow

요구사항:
- `/`, `/interview`, `/result` 라우트를 만든다.
- 모바일 화면 폭 375px~430px 기준으로 UI를 구성한다.
- 데스크톱에서는 모바일 프레임을 중앙 정렬한다.
- 아직 AI API는 연결하지 말고 mock 데이터로 동작시킨다.
- Zustand store에 InterviewSession, QuestionThread, InterviewQuestion, InterviewAnswer 상태를 정의한다.
- 타입은 문서의 확정 데이터 스키마를 따른다.

금지사항:
- 별도 백엔드 서버를 만들지 말 것
- DB를 추가하지 말 것
- 인증 기능을 추가하지 말 것
- 스키마를 임의로 변경하지 말 것
```
