import { useCallback, useRef, useState } from "react";
import type {
  InterviewAnswer,
  InterviewQuestion,
  InterviewSession,
  InterviewState,
  QuestionThread,
  AnalysisResult,
} from "../types";
import { ALL_CORE_QUESTIONS, TOTAL_CORE_QUESTIONS } from "../data/coreQuestions";
import {
  generateFollowUpQuestions,
  generateDeeperFollowUpQuestions,
  generateThreadSummary,
  runFullAnalysis,
} from "../services/aiService";

let answerCounter = 0;
let threadIdCounter = 0;

function createInitialSession(): InterviewSession {
  const threads: QuestionThread[] = ALL_CORE_QUESTIONS.map((cq) => ({
    coreQuestionId: cq.id,
    status: "active" as const,
    questions: [],
    answers: [],
  }));

  return {
    currentCoreIndex: 0,
    state: "core_question_answering",
    threads,
    currentQuestionId: null,
    currentFollowups: [],
    currentAnswerId: null,
    analysisResult: null,
  };
}

export function useInterview() {
  const [session, setSession] = useState<InterviewSession>(createInitialSession);
  const [loading, setLoading] = useState(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const currentCore = ALL_CORE_QUESTIONS[session.currentCoreIndex];
  const currentThread = session.threads[session.currentCoreIndex];

  const totalQuestions = TOTAL_CORE_QUESTIONS;
  const answeredCount = session.threads.filter(
    (t) => t.status === "closed" || t.answers.length > 0
  ).length;

  const updateState = useCallback((updater: (prev: InterviewSession) => InterviewSession) => {
    setSession((prev) => {
      const next = updater(prev);
      sessionRef.current = next;
      return next;
    });
  }, []);

  /**
   * Save a core answer and kick off follow-up generation.
   */
  const saveCoreAnswer = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const qId = `core_${currentCore.id}_${Date.now()}`;
      const answer: InterviewAnswer = {
        id: `a_${++answerCounter}`,
        questionId: qId,
        coreQuestionId: currentCore.id,
        depth: 0,
        answerText: text.trim(),
        createdAt: new Date().toISOString(),
      };

      updateState((prev) => {
        const threads = [...prev.threads];
        threads[prev.currentCoreIndex] = {
          ...threads[prev.currentCoreIndex],
          answers: [...threads[prev.currentCoreIndex].answers, answer],
        };
        return { ...prev, threads, state: "followup_generating" };
      });

      setLoading(true);
      const questions = await generateFollowUpQuestions(text, []);
      setLoading(false);

      updateState((prev) => {
        const threads = [...prev.threads];
        const thread = threads[prev.currentCoreIndex];
        const existing = thread.questions.filter(
          (q) => q.coreQuestionId === currentCore.id
        );
        const mapped = questions.map((q) => ({
          ...q,
          coreQuestionId: currentCore.id,
          parentAnswerId: answer.id,
        }));
        threads[prev.currentCoreIndex] = {
          ...thread,
          questions: [...existing, ...mapped],
        };
        return {
          ...prev,
          threads,
          currentFollowups: mapped,
          currentQuestionId: mapped[0]?.id || null,
          state: "followup_selecting" as InterviewState,
        };
      });
    },
    [currentCore.id, updateState]
  );

  /**
   * Select a follow-up question to answer.
   */
  const selectFollowUp = useCallback(
    (questionId: string) => {
      updateState((prev) => ({
        ...prev,
        currentQuestionId: questionId,
        state: "followup_answering",
      }));
    },
    [updateState]
  );

  /**
   * Save a follow-up answer and optionally generate deeper questions.
   */
  const saveFollowUpAnswer = useCallback(
    async (text: string, goDeeper: boolean) => {
      if (!text.trim()) return;

      const s = sessionRef.current;
      const question = s.threads[s.currentCoreIndex].questions.find(
        (q) => q.id === s.currentQuestionId
      );
      if (!question) return;

      const answer: InterviewAnswer = {
        id: `a_${++answerCounter}`,
        questionId: question.id,
        coreQuestionId: ALL_CORE_QUESTIONS[s.currentCoreIndex].id,
        parentAnswerId: s.currentAnswerId || undefined,
        depth: question.depth,
        answerText: text.trim(),
        createdAt: new Date().toISOString(),
      };

      updateState((prev) => {
        const threads = [...prev.threads];
        threads[prev.currentCoreIndex] = {
          ...threads[prev.currentCoreIndex],
          answers: [...threads[prev.currentCoreIndex].answers, answer],
        };
        return { ...prev, threads };
      });

      if (goDeeper) {
        setLoading(true);
        const depth = question.depth + 1;
        const deeperQuestions = await generateDeeperFollowUpQuestions(
          question.title,
          text,
          depth
        );
        setLoading(false);

        updateState((prev) => {
          const threads = [...prev.threads];
          const thread = threads[prev.currentCoreIndex];
          const mapped = deeperQuestions.map((q) => ({
            ...q,
            coreQuestionId: currentCore.id,
            parentAnswerId: answer.id,
            depth,
          }));
          threads[prev.currentCoreIndex] = {
            ...thread,
            questions: [...thread.questions, ...mapped],
          };
          return {
            ...prev,
            threads,
            currentFollowups: mapped,
            currentQuestionId: mapped[0]?.id || null,
            state: "followup_selecting" as InterviewState,
          };
        });
      } else {
        // Go back to selection with existing follow-ups
        updateState((prev) => {
          const thread = prev.threads[prev.currentCoreIndex];
          const unanswered = thread.questions.filter(
            (q) =>
              !thread.answers.some((a) => a.questionId === q.id) &&
              q.id !== prev.currentQuestionId
          );
          return {
            ...prev,
            currentFollowups: unanswered,
            currentQuestionId: unanswered[0]?.id || null,
            state:
              unanswered.length > 0
                ? ("followup_selecting" as InterviewState)
                : ("followup_selecting" as InterviewState),
          };
        });
      }
    },
    [currentCore.id, updateState]
  );

  /**
   * Close current thread and move to the next core question.
   */
  const closeThread = useCallback(async () => {
    const s = sessionRef.current;

    // Generate summary
    const thread = s.threads[s.currentCoreIndex];
    const coreQuestion = ALL_CORE_QUESTIONS[s.currentCoreIndex];
    setLoading(true);
    const summary = await generateThreadSummary(
      coreQuestion.title,
      thread.answers
    );
    setLoading(false);

    updateState((prev) => {
      const threads = [...prev.threads];
      threads[prev.currentCoreIndex] = {
        ...threads[prev.currentCoreIndex],
        status: "closed",
        summary,
      };

      const nextIndex = prev.currentCoreIndex + 1;
      if (nextIndex >= TOTAL_CORE_QUESTIONS) {
        return {
          ...prev,
          threads,
          state: "ready_to_analyze" as InterviewState,
        };
      }

      return {
        ...prev,
        threads,
        currentCoreIndex: nextIndex,
        currentFollowups: [],
        currentQuestionId: null,
        currentAnswerId: null,
        state: "core_question_answering" as InterviewState,
      };
    });
  }, [updateState]);

  /**
   * Skip the current core question.
   */
  const skipThread = useCallback(() => {
    updateState((prev) => {
      const threads = [...prev.threads];
      threads[prev.currentCoreIndex] = {
        ...threads[prev.currentCoreIndex],
        status: "skipped",
      };

      const nextIndex = prev.currentCoreIndex + 1;
      if (nextIndex >= TOTAL_CORE_QUESTIONS) {
        return {
          ...prev,
          threads,
          state: "ready_to_analyze" as InterviewState,
        };
      }

      return {
        ...prev,
        threads,
        currentCoreIndex: nextIndex,
        currentFollowups: [],
        currentQuestionId: null,
        currentAnswerId: null,
        state: "core_question_answering" as InterviewState,
      };
    });
  }, [updateState]);

  /**
   * Run full analysis on all collected answers.
   */
  const startAnalysis = useCallback(async () => {
    const s = sessionRef.current;
    setLoading(true);

    const allAnswers = s.threads.flatMap((t) => t.answers);
    const summaries = s.threads
      .filter((t) => t.summary)
      .map((t) => ({
        coreQuestionId: t.coreQuestionId,
        summary: t.summary!,
      }));

    const result = await runFullAnalysis(allAnswers, summaries);
    setLoading(false);

    updateState((prev) => ({
      ...prev,
      analysisResult: result,
      state: "core_question_answering", // will be redirected by page
    }));

    return result;
  }, [updateState]);

  /**
   * Reset the entire session.
   */
  const resetSession = useCallback(() => {
    answerCounter = 0;
    threadIdCounter = 0;
    setSession(createInitialSession());
  }, []);

  /**
   * Count answers in the current thread.
   */
  const currentAnswerCount = currentThread?.answers.length || 0;
  const totalAnswerCount = session.threads.reduce(
    (sum, t) => sum + t.answers.length,
    0
  );

  return {
    session,
    currentCore,
    currentThread,
    loading,
    totalQuestions,
    answeredCount,
    currentAnswerCount,
    totalAnswerCount,

    saveCoreAnswer,
    selectFollowUp,
    saveFollowUpAnswer,
    closeThread,
    skipThread,
    startAnalysis,
    resetSession,
  };
}
