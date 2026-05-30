import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-header">
        <span className="landing-badge">나를 발견하는 여정</span>
        <h1 className="landing-title">
          당신을
          <br />
          한 문장으로
          <br />
          표현한다면?
        </h1>
        <p className="landing-sub">
          AI와의 깊은 대화를 통해 당신의 인생관과 커리어를 탐색하고,
          <br />
          반복되는 패턴과 핵심 가치를 그래프로 발견하세요.
        </p>
        <button
          className="btn-primary btn-large"
          onClick={() => navigate("/interview")}
        >
          인터뷰 시작하기
        </button>
      </header>

      <section className="landing-steps">
        <div className="step-card">
          <div className="step-number">01</div>
          <h3>질문에 답변하기</h3>
          <p>
            인생과 커리어에 대한 8개의 핵심 질문에 솔직하게 답변하세요.
            정해진 정답은 없습니다.
          </p>
        </div>
        <div className="step-card">
          <div className="step-number">02</div>
          <h3>AI와 대화하며 깊이 탐색</h3>
          <p>
            답변을 바탕으로 AI가 꼬리질문을 만들어줍니다.
            원하는 만큼 깊이 파고들 수 있습니다.
          </p>
        </div>
        <div className="step-card">
          <div className="step-number">03</div>
          <h3>나를 그래프로 발견</h3>
          <p>
            모든 답변을 분석해 핵심 가치, 강점, 커리어 방향을
            시각화하고 한 문장으로 정리합니다.
          </p>
        </div>
      </section>

      <section className="landing-questions-preview">
        <h2>어떤 질문을 받게 되나요?</h2>
        <div className="question-chips">
          <span className="chip">최근 가장 크게 변한 부분</span>
          <span className="chip">좋은 삶의 모습</span>
          <span className="chip">'나답다'고 느끼는 순간</span>
          <span className="chip">답답함을 느끼는 상황</span>
          <span className="chip">가장 몰입했던 프로젝트</span>
          <span className="chip">일할 때 중요한 기준</span>
          <span className="chip">자연스럽게 잘하는 일</span>
          <span className="chip">앞으로 다뤄보고 싶은 분야</span>
        </div>
      </section>

      <footer className="landing-footer">
        <p>AI 자기성찰 인터뷰 · Life Career Graph</p>
      </footer>
    </div>
  );
}
