// ---- Core Types for Life Career Graph ----

export type QuestionCategory = "life" | "career";

export type QuestionIntent =
  | "concrete_example"
  | "emotion"
  | "reason"
  | "behavior"
  | "conflict"
  | "change"
  | "career_link"
  | "identity";

export interface CoreQuestion {
  id: string;
  category: QuestionCategory;
  title: string;
  description?: string;
  placeholder: string;
  order: number;
}

export interface InterviewQuestion {
  id: string;
  coreQuestionId: string;
  parentAnswerId?: string;
  type: "core" | "followup";
  depth: number;
  title: string;
  intent?: QuestionIntent;
  reason?: string;
}

export interface InterviewAnswer {
  id: string;
  questionId: string;
  coreQuestionId: string;
  parentAnswerId?: string;
  depth: number;
  answerText: string;
  createdAt: string;
}

export type ThreadStatus = "active" | "closed" | "skipped";

export interface QuestionThread {
  coreQuestionId: string;
  status: ThreadStatus;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  summary?: string;
}

export type ExtractedSignalType =
  | "value"
  | "strength"
  | "experience"
  | "emotion"
  | "blocker"
  | "career"
  | "identity";

export interface ExtractedSignal {
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
}

export interface MergedSignal {
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
}

export interface GraphNode {
  id: string;
  label: string;
  type: ExtractedSignalType;
  weight: number;
  evidence: string[];
}

export type GraphEdgeType =
  | "supports"
  | "causes"
  | "conflicts_with"
  | "expresses"
  | "leads_to"
  | "similar_to"
  | "reinforces";

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  weight: number;
  label: string;
  evidence: string[];
}

export interface AnalysisResult {
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
}

// Interview state machine

export type InterviewState =
  | "core_question_answering"
  | "followup_generating"
  | "followup_selecting"
  | "followup_answering"
  | "thread_closing"
  | "ready_to_analyze";

export interface InterviewSession {
  currentCoreIndex: number;
  state: InterviewState;
  threads: QuestionThread[];
  currentQuestionId: string | null;
  currentFollowups: InterviewQuestion[];
  currentAnswerId: string | null;
  analysisResult: AnalysisResult | null;
}
