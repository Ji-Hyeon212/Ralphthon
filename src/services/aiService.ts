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
import {
  generateFollowUpQuestions as mockFollowUp,
  generateDeeperFollowUpQuestions as mockDeeper,
  generateThreadSummary as mockSummary,
  runFullAnalysis as mockAnalysis,
} from "./mockAi";

// ── Client setup ──

function createClient(): OpenAI {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey || apiKey === "sk-...") {
    throw new APIKeyMissingError();
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
    timeout: 12000, // 12s max — don't hang forever
    maxRetries: 0,  // fail fast, fall back to mock
  });
}

class APIKeyMissingError extends Error {
  constructor() {
    super("VITE_OPENAI_API_KEY not configured");
    this.name = "APIKeyMissingError";
  }
}

// ── Shared helpers ──

const MODEL = "gpt-4o-mini";

/**
 * Safely parse JSON from an LLM response string.
 * Tries to extract a JSON block from markdown fences if needed.
 */
function parseJSON<T>(raw: string): T | null {
  try {
    let cleaned = raw.trim();
    const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      cleaned = fenceMatch[1].trim();
    }
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

// ── Prompt builders (minimal — faster LLM response) ──

const FOLLOWUP_SYSTEM = `당신은 사용자의 자기성찰을 돕는 인터뷰어입니다.
답변 속 구체적 경험, 감정, 선택 기준, 가치관, 커리어 방향성을 드러내는 심층 질문 2~4개를 생성하세요.

조건:
- 하나의 질문 = 하나의 의도
- 기존 답변 반복 금지
- 짧고 구체적으로
- 사용자를 평가/단정 금지
- 각 질문에 intent와 reason 포함
- 한국어로 작성
- 반드시 JSON 배열만 반환

intent 목록: concrete_example, emotion, reason, behavior, conflict, change, career_link, identity

반환 예시:
[{"question":"...","intent":"reason","reason":"..."}]`;

const DEEPER_SYSTEM = `당신은 사용자의 자기성찰을 돕는 인터뷰어입니다.
이전 심층 질문에 대한 답변을 바탕으로 더 깊이 파고드는 후속 질문 2~3개를 생성하세요.

조건:
- 답변에서 새롭게 드러난 정보 기반
- 반복 금지
- intent는 emotion, reason, behavior, conflict 중 선택
- 한국어, JSON 배열만 반환

반환 예시:
[{"question":"...","intent":"reason","reason":"..."}]`;

const SUMMARY_SYSTEM = `당신은 인터뷰 내용을 요약하는 AI입니다.
하나의 코어 질문에 대한 여러 답변을 분석해 핵심 키워드와 패턴을 포함한 1~2문장 요약을 생성하세요.
한국어로 작성, 일반 텍스트로 반환 (JSON 아님).`;

const ANALYSIS_SYSTEM = `당신은 사용자의 전체 인터뷰 답변을 바탕으로 인생관과 커리어 정체성을 분석하는 AI입니다.

해야 할 일:
1. 유사 신호 병합
2. 반복 요소에 높은 가중치 부여
3. 여러 코어 질문에서 반복된 요소는 더 중요하게
4. 그래프 노드와 엣지 생성
5. 한 문장 정체성 생성

가중치 기준: frequency, contextDiversity, confidence, depth, explicitness

주의:
- 답변에 없는 내용 과장 금지
- 의미 유사성 고려 (단순 단어 빈도 아님)
- 유사 표현은 상위 개념으로 병합
- 한국어로 작성
- 아래 정확한 JSON 형식으로만 응답`;

const ANALYSIS_FORMAT = `{
  "oneLineIdentity": "...",
  "summary": "...",
  "coreValues": [{"id":"...","label":"...","type":"value","weight":0.0,"frequency":0,"contextDiversity":0,"averageConfidence":0.0,"mergedFrom":[],"evidence":[],"sourceAnswerIds":[]}],
  "strengths": [],
  "careerDirection": {"summary":"","keywords":[],"evidence":[]},
  "riskPatterns": [{"label":"","recommendation":"","evidence":[]}],
  "graph": {
    "nodes": [{"id":"","label":"","type":"value|strength|experience|emotion|blocker|career|identity","weight":0.0,"evidence":[]}],
    "edges": [{"id":"","source":"","target":"","type":"supports|causes|conflicts_with|expresses|leads_to|similar_to|reinforces","weight":0.0,"label":"","evidence":[]}]
  }
}`;

// ── Exported functions ──

let questionIdCounter = 0;

/**
 * Generate follow-up questions — OpenAI with mock fallback.
 */
export async function generateFollowUpQuestions(
  answer: string,
  threadHistory: InterviewAnswer[] = [],
): Promise<InterviewQuestion[]> {
  try {
    const client = createClient();
    const threadSummary =
      threadHistory.length > 0
        ? threadHistory.map((a) => `A: ${a.answerText}`).join("\n")
        : "첫 답변";

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: FOLLOWUP_SYSTEM },
        { role: "user", content: `답변: ${answer}\n\n맥락: ${threadSummary}` },
      ],
      temperature: 0.6,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content || "[]";
    const parsed = parseJSON<{ question: string; intent: string; reason: string }[]>(raw);

    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 4).map((item, i) => ({
        id: `fq_${Date.now()}_${++questionIdCounter}`,
        coreQuestionId: "",
        type: "followup" as const,
        depth: 1,
        title: item.question,
        intent: item.intent as any,
        reason: item.reason,
      }));
    }
  } catch (err: any) {
    console.warn("OpenAI follow-up failed, using mock:", err.message);
  }

  // Fallback to mock
  return mockFollowUp(answer, threadHistory);
}

/**
 * Generate deeper follow-up questions — OpenAI with mock fallback.
 */
export async function generateDeeperFollowUpQuestions(
  currentQuestion: string,
  answer: string,
  depth: number,
): Promise<InterviewQuestion[]> {
  try {
    const client = createClient();

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: DEEPER_SYSTEM },
        { role: "user", content: `depth ${depth}\n질문: ${currentQuestion}\n답변: ${answer}` },
      ],
      temperature: 0.6,
      max_tokens: 600,
    });

    const raw = completion.choices[0]?.message?.content || "[]";
    const parsed = parseJSON<{ question: string; intent: string; reason: string }[]>(raw);

    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, i) => ({
        id: `fq_${Date.now()}_${++questionIdCounter}`,
        coreQuestionId: "",
        type: "followup" as const,
        depth: depth + 1,
        title: item.question,
        intent: item.intent as any,
        reason: item.reason,
      }));
    }
  } catch (err: any) {
    console.warn("OpenAI deep follow-up failed, using mock:", err.message);
  }

  return mockDeeper(currentQuestion, answer, depth);
}

/**
 * Generate thread summary — OpenAI with mock fallback.
 */
export async function generateThreadSummary(
  coreQuestion: string,
  answers: InterviewAnswer[],
): Promise<string> {
  try {
    const client = createClient();
    const answerTexts = answers.map((a, i) => `[${i + 1}] ${a.answerText}`).join("\n");

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SUMMARY_SYSTEM },
        { role: "user", content: `질문: "${coreQuestion}"\n\n${answerTexts}` },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (text) return text;
  } catch (err: any) {
    console.warn("OpenAI summary failed, using mock:", err.message);
  }

  return mockSummary(coreQuestion, answers);
}

/**
 * Run full analysis — OpenAI with mock fallback.
 */
export async function runFullAnalysis(
  allAnswers: InterviewAnswer[],
  threadSummaries: { coreQuestionId: string; summary: string }[],
): Promise<AnalysisResult> {
  try {
    const client = createClient();

    const structured = allAnswers
      .map((a) => `[${a.coreQuestionId}] depth=${a.depth}\n${a.answerText}`)
      .join("\n---\n");

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: `${ANALYSIS_SYSTEM}\n\n${ANALYSIS_FORMAT}` },
        { role: "user", content: structured || "(답변 없음)" },
      ],
      temperature: 0.4,
      max_tokens: 3000,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const result = parseJSON<AnalysisResult>(raw);

    if (result && result.oneLineIdentity) {
      const nodes = (result.graph?.nodes || []).map((n, i) => ({
        ...n,
        id: n.id || `node_${i}`,
      }));
      const edges = (result.graph?.edges || []).map((e, i) => ({
        ...e,
        id: e.id || `edge_${i}`,
      }));

      return {
        oneLineIdentity: result.oneLineIdentity,
        summary: result.summary || "",
        coreValues: result.coreValues || [],
        strengths: result.strengths || [],
        careerDirection: result.careerDirection || { summary: "", keywords: [], evidence: [] },
        riskPatterns: result.riskPatterns || [],
        graph: { nodes, edges },
      };
    }
  } catch (err: any) {
    console.warn("OpenAI analysis failed, using mock:", err.message);
  }

  return mockAnalysis(allAnswers, threadSummaries);
}
