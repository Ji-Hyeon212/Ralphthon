import type {
  InterviewAnswer,
  InterviewQuestion,
  AnalysisResult,
  MergedSignal,
  GraphNode,
  GraphEdge,
} from "../types";

/**
 * Mock AI service for the hackathon MVP.
 * Generates realistic follow-up questions, structures answers,
 * and produces an analysis result from collected answers.
 */

// ── Follow-up question templates keyed by intent ──

const FOLLOWUP_TEMPLATES: Record<
  string,
  { question: string; intent: string; reason: string }[]
> = {
  concrete_example: [
    {
      question: "그 생각이 강하게 들었던 실제 장면을 구체적으로 이야기해볼 수 있나요?",
      intent: "concrete_example",
      reason: "추상적 가치를 실제 경험으로 연결하기 위해",
    },
    {
      question: "그런 경험을 했을 때, 주변에는 누가 있었고 당신은 구체적으로 무엇을 하고 있었나요?",
      intent: "concrete_example",
      reason: "경험의 맥락과 구체적 상황을 파악하기 위해",
    },
  ],
  emotion: [
    {
      question: "그때 가장 크게 느낀 감정은 무엇이었고, 그 감정은 얼마나 오래 지속되었나요?",
      intent: "emotion",
      reason: "감정의 종류와 지속성을 확인하기 위해",
    },
    {
      question: "비슷한 상황에서 항상 같은 감정을 느끼나요, 아니면 상황에 따라 다른가요?",
      intent: "emotion",
      reason: "감정 패턴의 일관성을 파악하기 위해",
    },
  ],
  reason: [
    {
      question: "왜 그 기준이 당신에게 특히 중요하다고 느꼈나요?",
      intent: "reason",
      reason: "선택 기준의 근원을 이해하기 위해",
    },
    {
      question: "그 기준을 세우게 된 결정적인 경험이 있었다면 무엇인가요?",
      intent: "reason",
      reason: "가치관 형성에 영향을 준 경험을 찾기 위해",
    },
  ],
  behavior: [
    {
      question: "그 상황에서 당신은 보통 어떻게 행동하는 편인가요?",
      intent: "behavior",
      reason: "반복되는 행동 패턴을 파악하기 위해",
    },
    {
      question: "비슷한 상황에서 다르게 행동한 적이 있다면, 무엇이 달랐나요?",
      intent: "behavior",
      reason: "행동의 변이와 조건을 이해하기 위해",
    },
  ],
  conflict: [
    {
      question: "그 선택을 할 때 포기해야 했던 것은 무엇이었나요?",
      intent: "conflict",
      reason: "가치 충돌과 트레이드오프를 확인하기 위해",
    },
    {
      question: "두 가지 가치가 충돌할 때, 당신은 보통 어떤 쪽을 선택하는 편인가요?",
      intent: "conflict",
      reason: "의사결정의 우선순위를 파악하기 위해",
    },
  ],
  change: [
    {
      question: "그 경험 이후 당신의 생각이나 행동이 어떻게 달라졌나요?",
      intent: "change",
      reason: "경험을 통한 성장과 학습 패턴을 확인하기 위해",
    },
    {
      question: "변화하기 전과 후의 당신을 비교하면 가장 큰 차이는 무엇인가요?",
      intent: "change",
      reason: "변화의 방향성과 깊이를 측정하기 위해",
    },
  ],
  career_link: [
    {
      question: "이 경험이 앞으로의 일이나 진로 선택에 어떤 영향을 줄 것 같나요?",
      intent: "career_link",
      reason: "개인 경험과 커리어 방향의 연결점을 찾기 위해",
    },
    {
      question: "이런 가치를 충분히 발휘할 수 있는 직무나 환경은 어떤 모습일까요?",
      intent: "career_link",
      reason: "커리어 선호 조건을 구체화하기 위해",
    },
  ],
  identity: [
    {
      question: "이 답변이 당신을 어떤 사람이라고 설명한다고 생각하나요?",
      intent: "identity",
      reason: "자기 인식을 언어화하도록 돕기 위해",
    },
    {
      question: "다른 사람이 당신을 가장 자주 묘사하는 표현은 무엇인가요? 그것에 동의하나요?",
      intent: "identity",
      reason: "외부 평가와 자기 인식의 차이를 확인하기 위해",
    },
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Extract keywords from text (simple mock implementation).
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "그", "이", "저", "것", "수", "더", "때", "내", "나", "내가",
    "하는", "있다", "없다", "아니", "같다", "이런", "저런", "그런",
    "및", "의", "에", "가", "을", "를", "은", "는", "과", "와", "로",
    "으로", "에서", "부터", "까지", "처럼", "만큼", "이고", "이며",
  ]);
  const words = text.split(/[\s,.\n]+/);
  const freq = new Map<string, number>();
  for (const w of words) {
    if (w.length < 2 || stopWords.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

/**
 * Generate follow-up questions based on a user answer.
 * Returns 2-4 questions with different intents.
 */
export function generateFollowUpQuestions(
  answer: string,
  _threadHistory: InterviewAnswer[] = [],
): Promise<InterviewQuestion[]> {
  return new Promise((resolve) => {
    // Simulate AI processing delay
    setTimeout(() => {
      const keywords = extractKeywords(answer);
      const intents = shuffle([
        "concrete_example", "emotion", "reason", "behavior",
        "conflict", "change", "career_link", "identity",
      ]).slice(0, 3 + Math.floor(Math.random() * 2)); // 3-4 questions

      const questions = intents.map((intent, i) => {
        const template = pickRandom(FOLLOWUP_TEMPLATES[intent]);
        return {
          id: `fq_${Date.now()}_${i}`,
          coreQuestionId: "",
          type: "followup" as const,
          depth: 1,
          title: template.question,
          intent: intent as any,
          reason: template.reason,
        };
      });

      // Personalize questions when keywords found
      if (keywords.length > 0 && questions.length > 0) {
        const kw = keywords[0];
        if (!questions[0].title.includes(kw) && Math.random() > 0.4) {
          questions[0].title = `"${kw}"에 대해 더 이야기해볼까요? ${questions[0].title}`;
        }
      }

      resolve(questions);
    }, 800 + Math.random() * 700);
  });
}

/**
 * Generate next-depth follow-up questions after a follow-up answer.
 * Higher depth produces more focused, personalized questions.
 */
export function generateDeeperFollowUpQuestions(
  currentQuestion: string,
  answer: string,
  depth: number,
): Promise<InterviewQuestion[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const keywords = extractKeywords(answer);
      const chosen = shuffle([
        FOLLOWUP_TEMPLATES.emotion,
        FOLLOWUP_TEMPLATES.reason,
        FOLLOWUP_TEMPLATES.behavior,
        FOLLOWUP_TEMPLATES.conflict,
      ]);

      const count = depth >= 2 ? 2 : 3;
      const questions = chosen.slice(0, count).map((_, i) => {
        const template = pickRandom(chosen[i % chosen.length]);
        return {
          id: `fq_${Date.now()}_${i}`,
          coreQuestionId: "",
          type: "followup" as const,
          depth: depth + 1,
          title: template.question,
          intent: template.intent as any,
          reason: template.reason,
        };
      });

      // Attach keyword to personalize
      if (keywords.length > 0) {
        const kw = keywords[Math.floor(Math.random() * keywords.length)];
        questions[0] = {
          ...questions[0],
          title: `아까 "${kw}"라고 말씀하셨는데, ${questions[0].title.toLowerCase()}`,
        };
      }

      resolve(questions);
    }, 600 + Math.random() * 500);
  });
}

/**
 * Thread summary generation (mock).
 */
export function generateThreadSummary(
  _coreQuestion: string,
  answers: InterviewAnswer[],
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const keywords = answers.flatMap((a) => extractKeywords(a.answerText));
      const unique = [...new Set(keywords)];
      const summary = `사용자는 "${_coreQuestion}"에 대해 ${answers.length}개의 답변을 통해 ` +
        `"${unique.slice(0, 3).join('", "')}" 등의 키워드와 관련된 경험과 가치를 표현했습니다. ` +
        `반복적으로 "${unique[0] || '성장'}"에 대한 관심이 드러납니다.`;
      resolve(summary);
    }, 300);
  });
}

/**
 * Full analysis (mock) - generates result from all collected answers.
 */
export function runFullAnalysis(
  allAnswers: InterviewAnswer[],
  threadSummaries: { coreQuestionId: string; summary: string }[],
): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Collect all keywords across answers
      const allKeywords = allAnswers.flatMap((a) => extractKeywords(a.answerText));
      const keywordFreq = new Map<string, number>();
      for (const kw of allKeywords) {
        keywordFreq.set(kw, (keywordFreq.get(kw) || 0) + 1);
      }

      const topKeywords = [...keywordFreq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([kw]) => kw);

      const keyValues = ["성장", "자율성", "의미", "관계", "도전", "안정"];
      const keyStrengths = ["구조화", "공감", "실행력", "분석력", "소통", "적응력"];

      // Build nodes from keyword patterns
      const nodes: GraphNode[] = [];
      const edges: GraphEdge[] = [];

      // Value nodes
      topKeywords.slice(0, 3).forEach((kw, i) => {
        nodes.push({
          id: `value_${i}`,
          label: kw,
          type: "value",
          weight: 0.7 + (3 - i) * 0.08,
          evidence: [`"${kw}" 관련 답변이 ${keywordFreq.get(kw)}회 등장`],
        });
      });

      // Add default values if we don't have enough
      if (nodes.length < 3) {
        keyValues.slice(0, 3 - nodes.length).forEach((v, i) => {
          nodes.push({
            id: `value_d_${i}`,
            label: v,
            type: "value",
            weight: 0.65,
            evidence: ["답변 패턴에서 추론된 가치"],
          });
        });
      }

      // Strength nodes
      keyStrengths.slice(0, 3).forEach((s, i) => {
        nodes.push({
          id: `strength_${i}`,
          label: s,
          type: "strength",
          weight: 0.6 + (3 - i) * 0.06,
          evidence: ["반복적으로 드러난 강점 패턴"],
        });
      });

      // Experience / emotion / identity nodes
      if (topKeywords.length > 3) {
        nodes.push({
          id: "exp_0",
          label: topKeywords[3],
          type: "experience",
          weight: 0.55,
          evidence: ["핵심 경험 키워드"],
        });
      }
      nodes.push({
        id: "identity_0",
        label: "문제를 구조화하는 사람",
        type: "identity",
        weight: 0.85,
        evidence: topKeywords.slice(0, 2).length > 0
          ? [`"${topKeywords.slice(0, 2).join('", "')}" 등에서 일관되게 드러난 정체성`]
          : ["전체 답변 패턴에서 도출된 정체성"],
      });

      // Edges between related nodes
      const valueNodes = nodes.filter((n) => n.type === "value");
      const strengthNodes = nodes.filter((n) => n.type === "strength");

      valueNodes.forEach((vn) => {
        strengthNodes.slice(0, 2).forEach((sn) => {
          edges.push({
            id: `e_${vn.id}_${sn.id}`,
            source: vn.id,
            target: sn.id,
            type: "supports",
            weight: 0.6,
            label: "강화",
            evidence: ["가치와 강점의 연결"],
          });
        });
      });

      if (nodes.find((n) => n.type === "identity")) {
        valueNodes.forEach((vn) => {
          edges.push({
            id: `e_id_${vn.id}`,
            source: "identity_0",
            target: vn.id,
            type: "expresses",
            weight: 0.7,
            label: "표현",
            evidence: ["정체성이 가치를 표현"],
          });
        });
      }

      // Build merged signals for cards
      const coreValues: MergedSignal[] = valueNodes.map((n) => ({
        id: `mv_${n.id}`,
        label: n.label,
        type: "value",
        weight: n.weight,
        frequency: keywordFreq.get(n.label) || 2,
        contextDiversity: Math.min(3, nodes.length),
        averageConfidence: 0.78,
        mergedFrom: [n.label],
        evidence: n.evidence,
        sourceAnswerIds: allAnswers.map((a) => a.id),
      }));

      const strengths: MergedSignal[] = strengthNodes.map((n) => ({
        id: `ms_${n.id}`,
        label: n.label,
        type: "strength",
        weight: n.weight,
        frequency: 2,
        contextDiversity: 2,
        averageConfidence: 0.72,
        mergedFrom: [n.label],
        evidence: n.evidence,
        sourceAnswerIds: allAnswers.map((a) => a.id),
      }));

      // Career direction
      const careerKeywords = allAnswers
        .filter((a) => a.coreQuestionId.startsWith("career"))
        .flatMap((a) => extractKeywords(a.answerText));

      const topCareer = [...new Set(careerKeywords)].slice(0, 3);

      const result: AnalysisResult = {
        oneLineIdentity: `나는 ${coreValues[0]?.label || "성장"}을 바탕으로 ${strengths[0]?.label || "구조화"}를 통해 경험을 의미 있는 방향으로 바꾸는 사람입니다.`,
        summary: threadSummaries.map((ts) => ts.summary).join(" "),
        coreValues,
        strengths,
        careerDirection: {
          summary: topCareer.length > 0
            ? `"${topCareer.join('", "')}" 등에 관심을 보이며, 자신의 가치를 실현할 수 있는 분야를 지향합니다.`
            : "자신의 강점과 가치를 활용해 의미 있는 결과를 만드는 커리어를 지향합니다.",
          keywords: topCareer.length > 0 ? topCareer : ["AI 서비스", "제품 개발", "데이터 분석"],
          evidence: allAnswers
            .filter((a) => a.coreQuestionId.startsWith("career"))
            .map((a) => a.answerText.slice(0, 60) + "..."),
        },
        riskPatterns: [
          {
            label: "완벽주의 성향",
            recommendation: "때로는 '충분히 좋은' 상태에서도 결정을 내리는 연습이 필요합니다.",
            evidence: ["여러 답변에서 높은 기준과 자기 기대치가 반복됨"],
          },
        ],
        graph: { nodes, edges },
      };

      resolve(result);
    }, 1500 + Math.random() * 1000);
  });
}
