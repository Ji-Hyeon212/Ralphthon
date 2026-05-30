import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import ResultGraph from "../components/ResultGraph";
import type { AnalysisResult, GraphNode } from "../types";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetSession } = useInterview();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const result: AnalysisResult | null =
    (location.state as any)?.result || null;

  // Fallback: try reading from session
  const { session } = useInterview();
  const analysisResult = result || session.analysisResult;

  if (!analysisResult) {
    return (
      <div className="result-page">
        <div className="result-empty">
          <h2>아직 분석 결과가 없습니다</h2>
          <p>인터뷰를 먼저 완료해주세요.</p>
          <button
            className="btn-primary"
            onClick={() => navigate("/interview")}
          >
            인터뷰하러 가기
          </button>
        </div>
      </div>
    );
  }

  const { oneLineIdentity, coreValues, strengths, careerDirection, graph } =
    analysisResult;

  return (
    <div className="result-page">
      <div className="result-container">
        {/* Identity Sentence */}
        <section className="result-identity">
          <span className="result-badge">나를 표현하는 한 문장</span>
          <h1 className="identity-sentence">{oneLineIdentity}</h1>
        </section>

        {/* Graph */}
        <section className="result-graph-section">
          <h2 className="section-title">핵심 관계 그래프</h2>
          <div className="graph-container">
            <ResultGraph
              nodes={graph.nodes}
              edges={graph.edges}
              onNodeClick={(node) => setSelectedNode(node)}
            />
          </div>
          {selectedNode && (
            <div className="node-detail">
              <h4>{selectedNode.label}</h4>
              <span className="node-type-badge">{typeLabel(selectedNode.type)}</span>
              <p className="node-weight">
                중요도: {(selectedNode.weight * 100).toFixed(0)}%
              </p>
              {selectedNode.evidence.length > 0 && (
                <div className="node-evidence">
                  <p className="evidence-label">근거:</p>
                  <ul>
                    {selectedNode.evidence.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Core Values */}
        <section className="result-cards-section">
          <h2 className="section-title">핵심 가치</h2>
          <div className="result-cards">
            {coreValues.map((v) => (
              <div
                key={v.id}
                className="result-card value-card"
                style={{
                  "--card-weight": v.weight,
                } as React.CSSProperties}
              >
                <div className="card-header">
                  <span className="card-label">{v.label}</span>
                  <span className="card-weight-badge">
                    {(v.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="card-evidence">
                  {v.evidence.slice(0, 2).map((e, i) => (
                    <p key={i} className="evidence-item">
                      "{e}"
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strengths */}
        <section className="result-cards-section">
          <h2 className="section-title">강점</h2>
          <div className="result-cards">
            {strengths.map((s) => (
              <div
                key={s.id}
                className="result-card strength-card"
                style={{
                  "--card-weight": s.weight,
                } as React.CSSProperties}
              >
                <div className="card-header">
                  <span className="card-label">{s.label}</span>
                  <span className="card-weight-badge">
                    {(s.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="card-evidence">
                  {s.evidence.slice(0, 2).map((e, i) => (
                    <p key={i} className="evidence-item">
                      "{e}"
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Career Direction */}
        <section className="result-cards-section">
          <h2 className="section-title">커리어 방향</h2>
          <div className="career-card">
            <p className="career-summary">{careerDirection.summary}</p>
            {careerDirection.keywords.length > 0 && (
              <div className="career-keywords">
                {careerDirection.keywords.map((kw) => (
                  <span key={kw} className="chip">
                    {kw}
                  </span>
                ))}
              </div>
            )}
            {careerDirection.evidence.length > 0 && (
              <details className="career-evidence">
                <summary>근거 답변 보기</summary>
                {careerDirection.evidence.map((e, i) => (
                  <p key={i} className="evidence-item">
                    "{e}"
                  </p>
                ))}
              </details>
            )}
          </div>
        </section>

        {/* Risk Patterns */}
        {analysisResult.riskPatterns.length > 0 && (
          <section className="result-cards-section">
            <h2 className="section-title">보완점</h2>
            <div className="result-cards">
              {analysisResult.riskPatterns.map((rp, i) => (
                <div key={i} className="result-card risk-card">
                  <div className="card-header">
                    <span className="card-label">{rp.label}</span>
                  </div>
                  <p className="risk-rec">{rp.recommendation}</p>
                  {rp.evidence.length > 0 && (
                    <div className="card-evidence">
                      {rp.evidence.map((e, j) => (
                        <p key={j} className="evidence-item">
                          "{e}"
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="result-actions">
          <button
            className="btn-primary"
            onClick={() => {
              resetSession();
              navigate("/interview");
            }}
          >
            다시 인터뷰하기
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            처음으로
          </button>
        </section>
      </div>
    </div>
  );
}

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    value: "가치",
    strength: "강점",
    experience: "경험",
    emotion: "감정",
    blocker: "제약",
    career: "커리어",
    identity: "정체성",
  };
  return labels[type] || type;
}
