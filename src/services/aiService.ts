/**
 * OpenAI-powered AI service.
 *
 * Replaces mockAi.ts with real LLM calls using the PRD prompts.
 * Same function signatures so useInterview.ts can swap imports directly.
 *
 * ⚠️ Client-side API key: The key is bundled into the browser JS.
 *    OK for hackathon MVP. For production, proxy through your own backend.
 */

import OpenAI from "openai";
import type {
  InterviewAnswer,
  InterviewQuestion,
  AnalysisResult,
} from "../types";

// ── Client setup ──

function createClient(): OpenAI {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error(
      "VITE_OPENAI_API_KEY is not set. Create a .env file at project root:\n" +
      "VITE_OPENAI_API_KEY=sk-..."
    );
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // required for browser usage
  });
}

// ── Shared helpers ──

const MODEL = "gpt-4o-mini"; // fast + cheap for hackathon; switch to gpt-4o for higher quality
const TEMPERATURE = 0.7;

/**
 * Safely parse JSON from an LLM response string.
 * Tries to extract a JSON block from markdown fences if needed.
 */
function parseJSON<T>(raw: string): T {
  // Strip markdown fences if present
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }
  return JSON.parse(cleaned) as T;
}

/**
 * Build a thread summary string from an answer list.
 */
function buildThreadSummary(
  coreQuestionTitle: string,
  answers: InterviewAnswer[],
): string {
  if (answers.length === 0) return "아직 답변이 없습니다.";
  const lines = answers.map(
    (a, i) => `[답변 ${i + 1}] ${a.answerText}`,
  );
  return `코어 질문: "${coreQuestionTitle}"\n${lines.join("\n")}`;
}

// ── Prompt builders ──

/**
 * PRD §14.1 — Follow-up question generation
 */
function buildFollowUpPrompt(
  coreQuestion: string,
  currentQuestion: string,
  answer: string,
  threadSummary: string,
): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    {
      role: "system",
      content: `당신은 사용자의 자기성찰을 돕는 인터뷰어입니다.

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
- 한국어로 질문을 생성하세요.

반환 형식:
[
  {
    "question": "...",
    "intent": "concrete_example | emotion | reason | behavior | conflict | change | career_link | identity",
    "reason": "..."
  }
]`,
    },
    {
      role: "user",
      content: `코어 질문:
${coreQuestion}

현재 질문:
${currentQuestion}

사용자 답변:
${answer}

이전 질문과 답변 요약:
${threadSummary}`,
    },
  ];
}

/**
 * PRD §14.3 — Full analysis prompt
 */
function buildAnalysisPrompt(
  structuredData: string,
): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    {
      role: "system",
      content: `당신은 사용자의 전체 인터뷰 답변을 바탕으로 인생관과 커리어 정체성을 분석하는 AI입니다.

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
- 모든 텍스트는 한국어로 생성하세요.
- 반드시 아래 정확한 JSON 형식으로만 응답하세요.

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
}`,
    },
    {
      role: "user",
      content: `입력 데이터:
${structuredData}`,
    },
  ];
}

// ── Deep follow-up prompt ──

function buildDeepFollowUpPrompt(
  currentQuestion: string,
  answer: string,
  depth: number,
): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    {
      role: "system",
      content: `당신은 사용자의 자기성찰을 돕는 인터뷰어입니다.

사용자가 이전 심층 질문에 답변했습니다. 이 답변을 바탕으로 더 깊이 파고드는 후속 질문 2~3개를 생성하세요.

목표는 답변 속에 숨어 있는 더 깊은 가치관, 감정 패턴, 행동 원칙, 숨겨진 가정을 발견하는 것입니다.

조건:
- depth ${depth} 단계의 심층 질문입니다. depth가 높을수록 더 집중되고 구체적인 질문을 만드세요.
- 답변에서 새롭게 드러난 정보를 기반으로 질문하세요.
- 이미 확인한 내용을 반복하지 마세요.
- 질문 의도는 emotion, reason, behavior, conflict 중에서 선택하세요.
- 반드시 JSON 배열만 반환하세요.
- 한국어로 질문하세요.

반환 형식:
[
  {
    "question": "...",
    "intent": "emotion | reason | behavior | conflict",
    "reason": "..."
  }
]`,
    },
    {
      role: "user",
      content: `현재 질문:
${currentQuestion}

사용자 답변:
${answer}`,
    },
  ];
}

// ── Thread summary prompt ──

function buildSummaryPrompt(
  coreQuestion: string,
  answers: InterviewAnswer[],
): OpenAI.Chat.ChatCompletionMessageParam[] {
  const answerTexts = answers
    .map((a, i) => `[답변 ${i + 1}] ${a.answerText}`)
    .join("\n");

  return [
    {
      role: "system",
      content: `당신은 인터뷰 내용을 요약하는 AI입니다.

사용자가 하나의 코어 질문에 대해 나눈 여러 답변을 분석하고, 핵심 키워드와 패턴을 포함한 1~2문장 요약을 생성하세요.

반드시 한국어로 작성하고, JSON이 아닌 일반 텍스트로 반환하세요.`,
    },
    {
      role: "user",
      content: `코어 질문: "${coreQuestion}"

답변들:
${answerTexts}

위 답변을 1~2문장으로 요약해주세요.`,
    },
  ];
}

// ── Exported functions (same signature as mockAi.ts) ──

let questionIdCounter = 0;

/**
 * Generate follow-up questions based on a user answer — calls OpenAI.
 */
export async function generateFollowUpQuestions(
  answer: string,
  threadHistory: InterviewAnswer[] = [],
): Promise<InterviewQuestion[]> {
  const client = createClient();

  const threadSummary =
    threadHistory.length > 0
      ? threadHistory.map((a) => `Q: ${a.questionId}\nA: ${a.answerText}`).join("\n")
      : "첫 번째 답변입니다.";

  const messages = buildFollowUpPrompt(
    "(사용자의 현재 코어 질문)",
    "(사용자의 현재 질문)",
    answer,
    threadSummary,
  );

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages,
      temperature: TEMPERATURE,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "[]";
    const parsed = parseJSON<{ question: string; intent: string; reason: string }[]>(raw);

    const questions: InterviewQuestion[] = (Array.isArray(parsed) ? parsed : []).map(
      (item, i) => ({
        id: `fq_${Date.now()}_${++questionIdCounter}`,
        coreQuestionId: "",
        type: "followup" as const,
        depth: 1,
        title: item.question,
        intent: item.intent as any,
        reason: item.reason,
      }),
    );

    return questions.slice(0, 4); // cap at 4
  } catch (err) {
    console.error("OpenAI follow-up generation failed:", err);
    throw err;
  }
}

/**
 * Generate deeper follow-up questions.
 */
export async function generateDeeperFollowUpQuestions(
  currentQuestion: string,
  answer: string,
  depth: number,
): Promise<InterviewQuestion[]> {
  const client = createClient();

  const messages = buildDeepFollowUpPrompt(currentQuestion, answer, depth);

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages,
      temperature: TEMPERATURE,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "[]";
    const parsed = parseJSON<{ question: string; intent: string; reason: string }[]>(raw);

    return (Array.isArray(parsed) ? parsed : []).map((item, i) => ({
      id: `fq_${Date.now()}_${++questionIdCounter}`,
      coreQuestionId: "",
      type: "followup" as const,
      depth: depth + 1,
      title: item.question,
      intent: item.intent as any,
      reason: item.reason,
    }));
  } catch (err) {
    console.error("OpenAI deep follow-up failed:", err);
    throw err;
  }
}

/**
 * Generate thread summary.
 */
export async function generateThreadSummary(
  coreQuestion: string,
  answers: InterviewAnswer[],
): Promise<string> {
  const client = createClient();
  const messages = buildSummaryPrompt(coreQuestion, answers);

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.5,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content?.trim() || "요약을 생성할 수 없습니다.";
  } catch (err) {
    console.error("OpenAI summary failed:", err);
    return buildThreadSummary(coreQuestion, answers);
  }
}

/**
 * Run full analysis on all collected answers — calls OpenAI.
 */
export async function runFullAnalysis(
  allAnswers: InterviewAnswer[],
  threadSummaries: { coreQuestionId: string; summary: string }[],
): Promise<AnalysisResult> {
  const client = createClient();

  // Build structured input
  const structured = [
    "=== 전체 인터뷰 데이터 ===\n",
    ...allAnswers.map(
      (a) =>
        `[${a.coreQuestionId}] depth=${a.depth} Q:${a.questionId}\n답변: ${a.answerText}\n`,
    ),
    "\n=== 스레드 요약 ===\n",
    ...threadSummaries.map((ts) => `[${ts.coreQuestionId}] ${ts.summary}`),
  ].join("\n");

  const messages = buildAnalysisPrompt(structured);

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.5,
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const result = parseJSON<AnalysisResult>(raw);

    // Assign stable IDs to nodes and edges
    const nodes = (result.graph?.nodes || []).map((n, i) => ({
      ...n,
      id: n.id || `node_${i}`,
    }));
    const edges = (result.graph?.edges || []).map((e, i) => ({
      ...e,
      id: e.id || `edge_${i}`,
    }));

    return {
      oneLineIdentity: result.oneLineIdentity || "분석 결과를 생성할 수 없습니다.",
      summary: result.summary || "",
      coreValues: result.coreValues || [],
      strengths: result.strengths || [],
      careerDirection: result.careerDirection || {
        summary: "",
        keywords: [],
        evidence: [],
      },
      riskPatterns: result.riskPatterns || [],
      graph: { nodes, edges },
    };
  } catch (err) {
    console.error("OpenAI analysis failed:", err);
    throw err;
  }
}
