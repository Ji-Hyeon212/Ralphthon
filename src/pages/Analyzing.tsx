import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";

const STEPS = [
  "답변 구조화 중...",
  "핵심 키워드 추출 중...",
  "유사 패턴 병합 중...",
  "가중치 계산 중...",
  "그래프 생성 중...",
  "한 문장으로 정리 중...",
];

export default function AnalyzingPage() {
  const navigate = useNavigate();
  const { session, startAnalysis } = useInterview();
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Animate through steps
      const interval = setInterval(() => {
        if (cancelled) return;
        setStepIndex((prev) => {
          if (prev < STEPS.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 500);

      // Run the actual analysis
      const result = await startAnalysis();
      if (cancelled) return;

      clearInterval(interval);
      setStepIndex(STEPS.length - 1);
      setDone(true);

      // Navigate to results after a brief pause
      setTimeout(() => {
        if (!cancelled) navigate("/result", { state: { result } });
      }, 800);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="analyzing-page">
      <div className="analyzing-container">
        <div className="analyzing-graph-preview">
          <svg viewBox="0 0 200 200" className="analyzing-graph-svg">
            {/* Animated nodes */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle
                key={i}
                cx={60 + Math.sin((Date.now() * 0.001 + i) * 0.5) * 50 + 30}
                cy={60 + Math.cos((Date.now() * 0.001 + i) * 0.5) * 50 + 30}
                r={6 + Math.sin(Date.now() * 0.002 + i) * 2}
                fill="var(--primary)"
                opacity={0.4 + Math.sin(Date.now() * 0.003 + i) * 0.3}
              >
                <animate
                  attributeName="cx"
                  values={`${40 + i * 20};${60 + i * 22};${40 + i * 20}`}
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${50 + i * 15};${70 + i * 18};${50 + i * 15}`}
                  dur={`${3 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
            {/* Connecting lines */}
            {[0, 1, 2].map((i) => (
              <line
                key={`l${i}`}
                x1={50 + i * 30}
                y1={60 + i * 10}
                x2={80 + i * 25}
                y2={50 + i * 20}
                stroke="var(--primary)"
                strokeWidth={1}
                opacity={0.2}
              />
            ))}
          </svg>
        </div>

        <h2 className="analyzing-title">분석 중...</h2>

        <div className="analyzing-steps">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className={`analyzing-step ${i <= stepIndex ? "active" : ""} ${i < stepIndex ? "done" : ""}`}
            >
              <span className="step-indicator">
                {i < stepIndex ? "✓" : i === stepIndex ? "●" : "○"}
              </span>
              <span className="step-text">{step}</span>
            </div>
          ))}
        </div>

        {done && (
          <p className="analyzing-done-text">
            분석이 완료되었습니다! 결과 페이지로 이동합니다...
          </p>
        )}
      </div>
    </div>
  );
}
