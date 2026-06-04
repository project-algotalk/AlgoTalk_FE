import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import AnalyzingLoader from "../../components/common/AnalyzingLoader";
import { fetchSessionResult } from "../../api/interviewApi";
import "./InterviewResultPage.css";

const STATUS_LABEL = {
  ANSWERED: { text: "답변", color: "#4caf50" },
  SKIPPED: { text: "건너뜀", color: "#ff9800" },
  QUALITY_FAIL: { text: "미흡", color: "#e57373" },
};

const getGrade = (total) => {
  if (total >= 70) return { text: "우수", color: "#4caf50" };
  if (total >= 40) return { text: "보통", color: "#ff9800" };
  return { text: "미흡", color: "#e57373" };
};

function CircleScore({ score, size = 88 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score ?? 0, 0), 100);
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? "#4caf50" : pct >= 40 ? "#ff9800" : "#e57373";

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
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
        fontSize={size < 70 ? 13 : 18}
        fontWeight="700"
        fill="#1a1a1a"
      >
        {score ?? "-"}
      </text>
    </svg>
  );
}

function ScoreBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="ir-bar-row">
      <span className="ir-bar-label">{label}</span>
      <div className="ir-bar-track">
        <div className="ir-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="ir-bar-value">{value}</span>
    </div>
  );
}

export default function InterviewResultPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const location = useLocation();

  const [result, setResult] = useState(location.state?.result ?? null);  // 기존 결과 있으면 바로 세팅
  const isResultComplete = location.state?.result &&
      !location.state.result.questions?.some(q => q.scores?.total === null);
  const [loading, setLoading] = useState(!isResultComplete);  // ← 초기값에서 바로 결정

  const [error, setError] = useState(null);

  const loadingRef = useRef(!isResultComplete)

  useEffect(() => {
    if (!loadingRef.current) return;

    let pollCount = 0;
    const MAX_POLL = 5;
    const POLL_INTERVAL = 3000;

    const fetchResult = () => {
        fetchSessionResult(sessionId)
            .then((data) => {
                const isAnalyzing = pollCount < MAX_POLL && (
                    data.questions?.some(q => q.scores?.total === null)
                    ||
                    data.questions?.length < data.totalQuestions
                );

                setResult(data);

                if (isAnalyzing) {
                    pollCount++;
                    setTimeout(fetchResult, POLL_INTERVAL);
                } else {
                    loadingRef.current = false
                    setLoading(false);
                }
            })
            .catch(() => {
              setError("결과를 불러오는데 실패했습니다.");
              loadingRef.current = false
                setLoading(false);
            });
    };

    fetchResult();
  }, [sessionId]);

  if (loading) return (
      <div className="ir-page">
          <Navbar />
          <AnalyzingLoader type="result" />
      </div>
  );

  if (error || !result) return (
    <div className="ir-page">
      <Navbar />
      <div className="ir-loading">{error ?? "결과를 찾을 수 없습니다."}</div>
    </div>
  );

  const questions = result.questions ?? [];

  // 전체 통계 계산 (전체 질문 기준 평균)
  const avgTotal = questions.length > 0
      ? Math.round(questions.reduce((s, q) => s + (q.scores?.total ?? 0), 0) / questions.length * 10) / 10
      : 0
  const avgContent = questions.length > 0
    ? Math.round(questions.reduce((s, q) => s + (q.scores?.content ?? 0), 0) / questions.length)
    : 0;
  const avgVoice = questions.length > 0
    ? Math.round(questions.reduce((s, q) => s + (q.scores?.voice ?? 0), 0) / questions.length)
    : 0;
  const avgGaze = questions.length > 0
    ? Math.round(questions.reduce((s, q) => s + (q.scores?.gaze ?? 0), 0) / questions.length)
    : 0;
  const avgSpeed = questions.length > 0
    ? Math.round(questions.reduce((s, q) => s + (q.scores?.speed ?? 0), 0) / questions.length)
    : 0;
  const avgGesture = questions.length > 0
    ? Math.round(questions.reduce((s, q) => s + (q.scores?.gesture ?? 0), 0) / questions.length)
    : 0;

  const statusCounts = questions.reduce((acc, q) => {
    acc[q.answerStatus] = (acc[q.answerStatus] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="ir-page">
      <Navbar />
      <div className="ir-container">
        <div className="ir-header">
          <div>
            <h1 className="ir-title">{result.sessionTitle}</h1>
            <p className="ir-subtitle">총 {result.totalQuestions}문항 · 답변 {statusCounts.ANSWERED ?? 0}개 · 건너뜀 {(statusCounts.SKIPPED ?? 0) + (statusCounts.QUALITY_FAIL ?? 0)}개</p>
          </div>
        </div>

        {/* 종합 점수 */}
        <section className="ir-score-section">
          <div className="ir-total-score-wrap">
            <CircleScore score={avgTotal} size={100} />
            <div>
              <p className="ir-score-main-label">종합 점수</p>
              <p className="ir-score-main-sub">전체 질문 기준 평균</p>
            </div>
          </div>

          <div className="ir-score-cards">
            <div className="ir-score-cards-row">
              <div className="ir-score-card">
                <span className="ir-score-card-label">답변 논리성</span>
                <span className="ir-score-card-value">{avgContent}</span>
                <span className="ir-score-card-max">/ 30</span>
              </div>
              <div className="ir-score-card">
                <span className="ir-score-card-label">추임새·발화</span>
                <span className="ir-score-card-value">{avgVoice}</span>
                <span className="ir-score-card-max">/ 15</span>
              </div>
            </div>
            <div className="ir-score-cards-row">
              <div className="ir-score-card">
                <span className="ir-score-card-label">답변 속도</span>
                <span className="ir-score-card-value">{avgSpeed}</span>
                <span className="ir-score-card-max">/ 15</span>
              </div>
              <div className="ir-score-card">
                <span className="ir-score-card-label">시선 분석</span>
                <span className="ir-score-card-value">{avgGaze}</span>
                <span className="ir-score-card-max">/ 25</span>
              </div>
              <div className="ir-score-card">
                <span className="ir-score-card-label">자세·제스처</span>
                <span className="ir-score-card-value">{avgGesture}</span>
                <span className="ir-score-card-max">/ 20</span>
              </div>
            </div>
          </div>
        </section>

        {/* 항목별 점수 바 */}
        {questions.length > 0 && (
          <section className="ir-section">
            <p className="ir-section-label">항목별 점수</p>
            <div className="ir-bar-list">
              <ScoreBar label="답변 논리성" value={avgContent} max={30} color="#5c6bc0" />
              <ScoreBar label="추임새·발화" value={avgVoice} max={15} color="#26a69a" />
              <ScoreBar label="답변 속도" value={avgSpeed} max={15} color="#ec407a" />
              <ScoreBar label="시선 분석" value={avgGaze} max={25} color="#ffa726" />
              <ScoreBar label="자세·제스처" value={avgGesture} max={20} color="#42a5f5" />
            </div>
          </section>
        )}

        {/* 질문별 피드백 */}
        <section className="ir-section">
          <p className="ir-section-label">질문별 피드백</p>
          <div className="ir-question-list">
            {questions.map((q, idx) => {
              const isAnswered = q.answerStatus === "ANSWERED";
              const grade = isAnswered
                ? getGrade(q.scores?.total ?? 0)
                : STATUS_LABEL[q.answerStatus] ?? STATUS_LABEL.SKIPPED;
              return (
                <div
                  key={q.sessionQuestionId}
                  className="ir-question-card"
                  onClick={() => navigate(
                    `/interview/result/${sessionId}/questions/${q.questionOrder}`,
                    { state: { result, qNo: q.questionOrder } }
                  )}
                >
                  <div className="ir-q-left">
                    <span className="ir-q-num">Q{q.questionOrder ?? idx + 1}</span>
                    <div className="ir-q-content">
                      <p className="ir-q-text">{q.questionText}</p>
                      {isAnswered && q.feedbackGood && (
                        <p className="ir-q-preview">{q.feedbackGood}</p>
                      )}
                      {!isAnswered && (
                        <p className="ir-q-preview ir-q-preview--muted">모범 답변을 확인해보세요.</p>
                      )}
                    </div>
                  </div>
                  <div className="ir-q-right">
                    <span className="ir-status-badge" style={{ background: grade.color + "1a", color: grade.color, borderColor: grade.color + "40" }}>
                      {grade.text}
                    </span>
                    {isAnswered && (
                      <span className="ir-q-score">{q.scores?.total ?? 0}점</span>
                    )}
                    <span className="ir-q-arrow">›</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="ir-footer">
          <button className="ir-btn-home" onClick={() => navigate("/interview")}>
            면접 보기
          </button>
        </div>
      </div>
    </div>
  );
}