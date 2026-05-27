import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { fetchSessionResult } from "../../api/interviewApi";
import "./InterviewFeedbackPage.css";

const STATUS_LABEL = {
  ANSWERED: { text: "답변", color: "#4caf50" },
  SKIPPED: { text: "건너뜀", color: "#ff9800" },
  QUALITY_FAIL: { text: "미흡", color: "#e57373" },
};

function CircleScore({ score, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score ?? 0, 0), 100);
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? "#4caf50" : pct >= 40 ? "#ff9800" : "#e57373";

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px` }}
        fontSize={14}
        fontWeight="700"
        fill="#1a1a1a"
      >
        {score ?? "-"}
      </text>
    </svg>
  );
}

function ScoreCard({ label, value, max, color }) {
  return (
    <div className="if-score-card">
      <span className="if-score-card-label">{label}</span>
      <div className="if-score-card-bottom">
        <span className="if-score-card-value" style={{ color }}>{value ?? 0}</span>
        <span className="if-score-card-max">/ {max}</span>
      </div>
    </div>
  );
}

export default function InterviewFeedbackPage() {
  const navigate = useNavigate();
  const { sessionId, qNo } = useParams();
  const location = useLocation();

  const [fetchedResult, setFetchedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stateResult = location.state?.result;

  useEffect(() => {
    // state가 없으면 (직접 URL 접근) API 재조회
    if (!stateResult) {
      setLoading(true);
      fetchSessionResult(sessionId)
        .then(setFetchedResult)
        .catch(() => setError("결과를 불러오는데 실패했습니다."))
        .finally(() => setLoading(false));
    }
  }, [sessionId, stateResult]);

  const result = stateResult ?? fetchedResult;
  const questions = result?.questions ?? [];
  const currentOrder = Number(qNo);
  const q = questions.find(q => q.questionOrder === currentOrder);

  const prevQ = questions.find(q => q.questionOrder === currentOrder - 1);
  const nextQ = questions.find(q => q.questionOrder === currentOrder + 1);

  if (loading) return (
    <div className="if-page">
      <Navbar />
      <div className="if-loading">결과를 불러오는 중...</div>
    </div>
  );

  if (error) return (
    <div className="if-page">
      <Navbar />
      <div className="if-loading">{error}</div>
    </div>
  );

  if (!result || !q) return (
    <div className="if-page">
      <Navbar />
      <div className="if-loading">질문 정보를 찾을 수 없습니다.</div>
    </div>
  );

  const status = STATUS_LABEL[q.answerStatus] ?? STATUS_LABEL.SKIPPED;
  const totalScore = q.scores?.total ?? 0;

  // 발화·침묵 비율 계산
  const silencePct = Math.min(q.silenceRatio ?? 0, 100);
  const speechPct = Math.max(100 - silencePct, 0);

  // gestureDeductions 요약
  const gestureTypeLabel = {
    HAND_VISIBLE: "손 노출",
    HAND_WAVING: "손 흔들기",
    FACE_TOUCH: "얼굴 터치",
    SLOUCH: "자세 불량",
  };

  return (
    <div className="if-page">
      <Navbar />
      <div className="if-container">

        {/* 상단: 질문 + 점수 */}
        <div className="if-question-header">
          <div className="if-question-meta">
            <span className="if-q-order">Q{q.questionOrder}</span>
            <span
              className="if-status-badge"
              style={{ background: status.color + "1a", color: status.color, borderColor: status.color + "40" }}
            >
              {status.text}
            </span>
          </div>
          <div className="if-question-row">
            <p className="if-question-text">{q.questionText}</p>
            <div className="if-circle-wrap">
              <CircleScore score={totalScore} size={80} />
              <span className="if-circle-label">질문 점수</span>
            </div>
          </div>
        </div>

        {/* 이전/다음 네비게이션 */}
        <div className="if-nav">
          {prevQ ? (
            <button
              className="if-nav-btn"
              onClick={() => navigate(
                `/interview/result/${sessionId}/questions/${prevQ.questionOrder}`,
                { state: { result, qNo: prevQ.questionOrder } }
              )}
            >
              ‹ 이전 질문
            </button>
          ) : <span />}
          {nextQ && (
            <button
              className="if-nav-btn if-nav-btn--next"
              onClick={() => navigate(
                `/interview/result/${sessionId}/questions/${nextQ.questionOrder}`,
                { state: { result, qNo: nextQ.questionOrder } }
              )}
            >
              다음 질문 ›
            </button>
          )}
        </div>

        {/* 내 답변 / 모범 답변 */}
        <div className="if-answer-grid">
          <div className="if-answer-box">
            <p className="if-answer-title">내 답변</p>
            <p className="if-answer-text">
              {q.answerText?.trim() ? q.answerText : "답변 내용이 없습니다."}
            </p>
          </div>
          <div className="if-answer-box if-answer-box--model">
            <p className="if-answer-title">모범 답변</p>
            <p className="if-answer-text">
              {q.modelAnswer ?? "모범 답변을 생성하지 못했습니다."}
            </p>
          </div>
        </div>

        {/* 항목별 점수 (2+3 그리드) */}
        <section className="if-section">
          <p className="if-section-label">항목별 점수</p>
          <div className="if-score-grid">
            <div className="if-score-row">
              <ScoreCard label="답변 논리성" value={q.scores?.content} max={30} color="#5c6bc0" />
              <ScoreCard label="추임새·발화" value={q.scores?.voice} max={15} color="#26a69a" />
            </div>
            <div className="if-score-row">
              <ScoreCard label="답변 속도" value={q.scores?.speed} max={15} color="#ec407a" />
              <ScoreCard label="시선 분석" value={q.scores?.gaze} max={25} color="#ffa726" />
              <ScoreCard label="자세·제스처" value={q.scores?.gesture} max={20} color="#42a5f5" />
            </div>
          </div>
        </section>

        {/* 발화 및 침묵 비율 */}
        <section className="if-section">
          <p className="if-section-label">발화 및 침묵 비율</p>
          <div className="if-speech-bar-wrap">
            <div className="if-speech-bar">
              <div className="if-speech-fill if-speech-fill--speech" style={{ width: `${speechPct}%` }} />
              <div className="if-speech-fill if-speech-fill--silence" style={{ width: `${silencePct}%` }} />
            </div>
            <div className="if-speech-legend">
              <span className="if-legend-dot if-legend-dot--speech" />발화 {speechPct.toFixed(1)}%
              <span className="if-legend-dot if-legend-dot--silence" />침묵 {silencePct.toFixed(1)}%
            </div>
          </div>
          <div className="if-speech-stats">
            <div className="if-speech-stat">
              <span className="if-speech-stat-label">WPM</span>
              <span className="if-speech-stat-value">{q.wpm ?? 0}</span>
            </div>
            <div className="if-speech-stat">
              <span className="if-speech-stat-label">추임새 횟수</span>
              <span className="if-speech-stat-value">{q.fillerCount ?? 0}회</span>
            </div>
            <div className="if-speech-stat">
              <span className="if-speech-stat-label">답변 시간</span>
              <span className="if-speech-stat-value">{q.answerDuration ?? 0}초</span>
            </div>
          </div>
        </section>

        {/* 자세·제스처 상세 */}
        {q.gestureDeductions?.length > 0 && (
          <section className="if-section">
            <p className="if-section-label">자세·제스처 상세</p>
            <div className="if-gesture-list">
              {q.gestureDeductions.map((g, i) => (
                <div key={i} className="if-gesture-row">
                  <span className="if-gesture-type">{gestureTypeLabel[g.type] ?? g.type}</span>
                  <span className="if-gesture-count">{g.count}회</span>
                  <span className="if-gesture-deduction">-{g.deduction}점</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI 피드백 */}
        {q.answerStatus === "ANSWERED" && (q.feedbackGood || q.feedbackImprove || q.feedbackAddition) && (
          <section className="if-section">
            <p className="if-section-label">AI 피드백</p>
            <div className="if-feedback-list">
              {q.feedbackGood && (
                <div className="if-feedback-item if-feedback-item--good">
                  <span className="if-feedback-icon">👍</span>
                  <div>
                    <p className="if-feedback-type">잘한 점</p>
                    <p className="if-feedback-text">{q.feedbackGood}</p>
                  </div>
                </div>
              )}
              {q.feedbackImprove && (
                <div className="if-feedback-item if-feedback-item--improve">
                  <span className="if-feedback-icon">💡</span>
                  <div>
                    <p className="if-feedback-type">개선할 점</p>
                    <p className="if-feedback-text">{q.feedbackImprove}</p>
                  </div>
                </div>
              )}
              {q.feedbackAddition && (
                <div className="if-feedback-item if-feedback-item--addition">
                  <span className="if-feedback-icon">➕</span>
                  <div>
                    <p className="if-feedback-type">추가하면 좋은 내용</p>
                    <p className="if-feedback-text">{q.feedbackAddition}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 학습 팁 */}
        {q.studyTip && (
          <section className="if-section if-section--tip">
            <p className="if-section-label">📚 학습 팁</p>
            <p className="if-tip-text">{q.studyTip}</p>
          </section>
        )}

        {/* 꼬리 질문 */}
        {q.followUpQuestions?.length > 0 && (
          <section className="if-section">
            <p className="if-section-label">💬 꼬리 질문</p>
            <div className="if-followup-list">
              {q.followUpQuestions.map((fq, i) => (
                <div key={i} className="if-followup-item">
                  <span className="if-followup-num">Q{i + 1}</span>
                  <span className="if-followup-text">{fq}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 하단 버튼 */}
        <div className="if-footer">
          <button
            className="if-btn-back"
            onClick={() => navigate(`/interview/result/${sessionId}`, { state: { result } })}
          >
            결과 요약으로
          </button>
        </div>
      </div>
    </div>
  );
}