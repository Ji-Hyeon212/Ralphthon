import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import { ALL_CORE_QUESTIONS, TOTAL_CORE_QUESTIONS } from "../data/coreQuestions";
import type { InterviewQuestion } from "../types";

export default function InterviewPage() {
  const navigate = useNavigate();
  const {
    session,
    currentCore,
    loading,
    totalAnswerCount,
    saveCoreAnswer,
    selectFollowUp,
    saveFollowUpAnswer,
    closeThread,
    skipThread,
    startAnalysis,
  } = useInterview();

  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLastQuestion =
    session.currentCoreIndex >= TOTAL_CORE_QUESTIONS - 1;

  const handleCoreSubmit = useCallback(async () => {
    if (!inputValue.trim() || submitting) return;
    setSubmitting(true);
    await saveCoreAnswer(inputValue);
    setInputValue("");
    setSubmitting(false);
  }, [inputValue, submitting, saveCoreAnswer]);

  const handleFollowUpAnswer = useCallback(
    async (goDeeper: boolean) => {
      if (!inputValue.trim() || submitting) return;
      setSubmitting(true);
      await saveFollowUpAnswer(inputValue, goDeeper);
      setInputValue("");
      setSubmitting(false);
    },
    [inputValue, submitting, saveFollowUpAnswer]
  );

  const handleAnalyze = useCallback(async () => {
    await startAnalysis();
    navigate("/analyzing");
  }, [startAnalysis, navigate]);

  const progressPercent =
    ((session.currentCoreIndex) / TOTAL_CORE_QUESTIONS) * 100;

  // ── States ──

  const renderCoreAnswering = () => (
    <div className="interview-core">
      <div className="interview-progress-mini">
        <div className="progress-track-mini">
          <div
            className="progress-fill-mini"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="progress-text-mini">
          {session.currentCoreIndex + 1} / {TOTAL_CORE_QUESTIONS}
        </span>
      </div>

      <div className="core-question-card">
        <span className="core-badge">
          {currentCore.category === "life" ? "인생관" : "커리어"}
        </span>
        <h2 className="core-title">{currentCore.title}</h2>
        {currentCore.description && (
          <p className="core-desc">{currentCore.description}</p>
        )}
      </div>

      <div className="answer-area">
        <textarea
          className="answer-input"
          placeholder={currentCore.placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={5}
          disabled={loading || submitting}
        />
        <div className="answer-actions">
          <span className="answer-count-hint">
            {totalAnswerCount}개의 답변을 저장했어요
          </span>
          <button
            className="btn-primary"
            onClick={handleCoreSubmit}
            disabled={!inputValue.trim() || loading || submitting}
          >
            {loading || submitting ? (
              <span className="btn-loading">분석 중...</span>
            ) : (
              "답변 저장하고 심층 질문 받기"
            )}
          </button>
        </div>
        <button className="btn-text" onClick={skipThread}>
          이 질문 건너뛰기
        </button>
      </div>
    </div>
  );

  const renderFollowupGenerating = () => (
    <div className="interview-loading">
      <div className="loading-spinner" />
      <p>답변을 분석하고 심층 질문을 만들고 있어요...</p>
    </div>
  );

  const renderFollowupSelecting = () => {
    const unanswered = session.currentFollowups;
    if (unanswered.length === 0) {
      return (
        <div className="interview-core">
          <p className="no-questions-hint">
            모든 질문에 답변하셨습니다. 더 깊이 탐색하거나 다음으로 넘어갈 수 있습니다.
          </p>
          <div className="answer-actions">
            {!isLastQuestion && (
              <button className="btn-secondary" onClick={closeThread}>
                다음 코어 질문으로
              </button>
            )}
            {isLastQuestion && (
              <button className="btn-primary" onClick={handleAnalyze}>
                전체 분석하기
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="interview-followup-select">
        <div className="followup-header">
          <h3>AI가 더 깊게 생각해볼 질문을 만들었습니다</h3>
          <p className="followup-hint">
            관심 가는 질문을 선택해 답변해보세요
          </p>
        </div>

        <div className="followup-list">
          {unanswered.map((q, idx) => (
            <div
              key={q.id}
              className="followup-card"
              onClick={() => selectFollowUp(q.id)}
            >
              <span className="followup-num">{idx + 1}</span>
              <div className="followup-content">
                <p className="followup-question">{q.title}</p>
                {q.intent && (
                  <span className="followup-intent-tag">{intentLabel(q.intent)}</span>
                )}
              </div>
              <button
                className="btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  selectFollowUp(q.id);
                }}
              >
                답변하기
              </button>
            </div>
          ))}
        </div>

        <div className="followup-nav-actions">
          {!isLastQuestion && (
            <button className="btn-secondary" onClick={closeThread}>
              이 질문은 여기까지
            </button>
          )}
          <button className="btn-text" onClick={skipThread}>
            {isLastQuestion ? "분석으로 넘어가기" : "다음 코어 질문으로"}
          </button>
          {isLastQuestion && (
            <button className="btn-primary" onClick={handleAnalyze}>
              전체 분석하기
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderFollowupAnswering = () => {
    const currentQ = session.threads[session.currentCoreIndex].questions.find(
      (q) => q.id === session.currentQuestionId
    );

    if (!currentQ) {
      return renderFollowupSelecting();
    }

    return (
      <div className="interview-followup-answer">
        <div className="current-question-card">
          <span className="core-badge">
            {currentCore.category === "life" ? "인생관" : "커리어"}
            {currentQ.depth > 0 && ` · Depth ${currentQ.depth}`}
          </span>
          <p className="current-question">{currentQ.title}</p>
          {currentQ.reason && (
            <p className="current-question-reason">{currentQ.reason}</p>
          )}
        </div>

        <div className="answer-area">
          <textarea
            className="answer-input"
            placeholder="편하게 답변해주세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={4}
            disabled={loading || submitting}
          />
          <div className="answer-actions vertical">
            <button
              className="btn-primary"
              onClick={() => handleFollowUpAnswer(true)}
              disabled={!inputValue.trim() || loading || submitting}
            >
              {loading || submitting ? (
                <span className="btn-loading">생성 중...</span>
              ) : (
                "답변하고 더 파고들기"
              )}
            </button>
            <button
              className="btn-secondary"
              onClick={() => handleFollowUpAnswer(false)}
              disabled={!inputValue.trim() || loading || submitting}
            >
              답변만 저장하기
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReadyToAnalyze = () => (
    <div className="interview-ready">
      <h2>모든 인터뷰가 완료되었습니다</h2>
      <p>
        {totalAnswerCount}개의 답변을 수집했습니다. 지금까지의 대화를 바탕으로
        당신을 분석해보겠습니다.
      </p>
      <button className="btn-primary btn-large" onClick={handleAnalyze}>
        전체 분석 시작하기
      </button>
    </div>
  );

  const state = session.state;

  return (
    <div className="interview-page">
      <div className="interview-container">
        {state === "core_question_answering" && renderCoreAnswering()}
        {state === "followup_generating" && renderFollowupGenerating()}
        {state === "followup_selecting" && renderFollowupSelecting()}
        {state === "followup_answering" && renderFollowupAnswering()}
        {state === "ready_to_analyze" && renderReadyToAnalyze()}
      </div>
    </div>
  );
}

function intentLabel(intent: string): string {
  const labels: Record<string, string> = {
    concrete_example: "구체적 경험",
    emotion: "감정 탐색",
    reason: "이유 분석",
    behavior: "행동 패턴",
    conflict: "가치 충돌",
    change: "변화 추적",
    career_link: "커리어 연결",
    identity: "정체성",
  };
  return labels[intent] || intent;
}
