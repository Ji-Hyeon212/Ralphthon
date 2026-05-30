import type { CoreQuestion } from "../types";

export const LIFE_QUESTIONS: CoreQuestion[] = [
  {
    id: "life_01",
    category: "life",
    title: "최근 몇 년 동안 가장 크게 변했다고 느끼는 부분은 무엇인가요?",
    description:
      "변화의 계기, 성장 방향, 자기 인식, 가치관 변화를 살펴봅니다.",
    placeholder:
      "예: 회사에서 새로운 역할을 맡으면서 책임감이 생겼고, 더 주도적으로 행동하게 되었어요...",
    order: 1,
  },
  {
    id: "life_02",
    category: "life",
    title: "당신이 좋은 삶이라고 느끼는 삶은 어떤 모습인가요?",
    description: "핵심 가치, 삶의 우선순위, 만족 조건을 탐색합니다.",
    placeholder:
      "예: 내가 선택한 시간을 살아가는 것, 의미 있는 사람들과 함께 성장하는 삶...",
    order: 2,
  },
  {
    id: "life_03",
    category: "life",
    title: "어떤 순간에 '이건 나답다'고 느끼나요?",
    description: "자기 정체성, 자연스러운 행동 패턴, 몰입 조건을 찾습니다.",
    placeholder:
      "예: 복잡한 문제를 구조화해서 다른 사람에게 설명할 때 가장 나답다고 느껴요...",
    order: 3,
  },
  {
    id: "life_04",
    category: "life",
    title: "반대로 어떤 상황에서 가장 답답함이나 불편함을 느끼나요?",
    description: "회피 요소, 가치 충돌, 스트레스 원인을 알아봅니다.",
    placeholder:
      "예: 명확한 이유 없이 반복되는 일을 해야 할 때, 성장이 정체된 느낌이 들 때...",
    order: 4,
  },
];

export const CAREER_QUESTIONS: CoreQuestion[] = [
  {
    id: "career_01",
    category: "career",
    title: "지금까지 가장 몰입했던 일이나 프로젝트는 무엇인가요?",
    description: "직무 흥미, 몰입 조건, 문제 해결 방식을 파악합니다.",
    placeholder:
      "예: 대학교 때 진행한 팀 프로젝트에서 아이디어를 내고 직접 구현했던 경험이 가장 몰입했어요...",
    order: 1,
  },
  {
    id: "career_02",
    category: "career",
    title: "일할 때 가장 중요하게 생각하는 기준은 무엇인가요?",
    description: "직업 가치관, 조직 선호, 의사결정 기준을 탐색합니다.",
    placeholder:
      "예: 자율적으로 판단할 수 있는 환경, 내 결정이 실제 결과로 이어지는 일...",
    order: 2,
  },
  {
    id: "career_03",
    category: "career",
    title: "다른 사람보다 비교적 자연스럽게 잘하는 일은 무엇인가요?",
    description: "강점, 역량, 협업 방식, 문제 접근 방식을 분석합니다.",
    placeholder:
      "예: 복잡한 요구사항을 정리해서 팀이 이해하기 쉬운 단위로 나누는 것...",
    order: 3,
  },
  {
    id: "career_04",
    category: "career",
    title: "앞으로 커리어에서 꼭 다뤄보고 싶은 문제나 분야가 있나요?",
    description: "관심 도메인, 장기 커리어 방향을 발견합니다.",
    placeholder:
      "예: AI 기술을 활용해서 사람들의 일상적인 문제를 해결하는 서비스를 만들고 싶어요...",
    order: 4,
  },
];

export const ALL_CORE_QUESTIONS: CoreQuestion[] = [
  ...LIFE_QUESTIONS,
  ...CAREER_QUESTIONS,
];

/**
 * Returns the index of a core question in the master list.
 */
export function getCoreQuestionIndex(id: string): number {
  return ALL_CORE_QUESTIONS.findIndex((q) => q.id === id);
}

/**
 * Returns the total number of core questions.
 */
export const TOTAL_CORE_QUESTIONS = ALL_CORE_QUESTIONS.length;
