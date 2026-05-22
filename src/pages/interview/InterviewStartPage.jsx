import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import {
  fetchCsCategories,
  createLlmSession,
  createManualSession,
} from "../../api/interviewApi";
import "./InterviewStartPage.css";

const MODE = {
  LLM: "llm",
  MANUAL: "manual",
  SCRAP: "scrap",
};

export default function InterviewStartPage() {
  const navigate = useNavigate();

  // 질문 구성 방식
  const [mode, setMode] = useState(MODE.LLM);

  // 카테고리 데이터
  const [commonCategories, setCommonCategories] = useState([]); // COMMON_CS
  const [jobCategories, setJobCategories] = useState([]); // JOB (depth 1)
  const [jobSubCategories, setJobSubCategories] = useState([]); // JOB (depth 2)

  // LLM 모드 선택 상태
  const [selectedCategories, setSelectedCategories] = useState([]); // { categoryId, categoryType }
  const [questionCount, setQuestionCount] = useState(3);

  // 직접입력 모드 상태
  const [manualQuestions, setManualQuestions] = useState([
    { id: Date.now(), categoryId: null, categoryName: "", questionText: "" },
  ]);

  // 로딩/에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCsCategories().then((data) => {
      // COMMON_CS depth 1 (자료구조/알고리즘, 데이터베이스 등)
      const common = data
        .filter((c) => c.categoryType === "COMMON_CS" && c.depth === 1)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      setCommonCategories(common);

      // JOB depth 1 (기타/직접입력 categoryId 24 제외)
      const jobDepth1 = data
        .filter(
          (c) =>
            c.categoryType === "JOB" && c.depth === 1 && c.categoryId !== 24,
        )
        .sort((a, b) => a.sortOrder - b.sortOrder);
      setJobCategories(jobDepth1);

      // JOB depth 2 (백엔드 개발자, 프론트엔드 개발자 등)
      const jobDepth2 = data
        .filter((c) => c.categoryType === "JOB" && c.depth === 2)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      setJobSubCategories(jobDepth2);
    });
  }, []);

  // ── LLM 모드: 카테고리 토글
  const toggleCategory = (categoryId, categoryType) => {
    const isSelected = selectedCategories.some(
      (c) => c.categoryId === categoryId,
    );
    if (isSelected) {
      setSelectedCategories((prev) =>
        prev.filter((c) => c.categoryId !== categoryId),
      );
    } else {
      if (selectedCategories.length >= 3) return;
      setSelectedCategories((prev) => [...prev, { categoryId, categoryType }]);
    }
  };

  // ── 직접입력 모드: 질문 추가/삭제/변경
  const addManualQuestion = () => {
    if (manualQuestions.length >= 5) return;
    setManualQuestions((prev) => [
      ...prev,
      { id: Date.now(), categoryId: null, categoryName: "", questionText: "" },
    ]);
  };

  const removeManualQuestion = (id) => {
    if (manualQuestions.length <= 1) return;
    setManualQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateManualQuestion = (id, updates) => {
    setManualQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    );
  };

  // ── 면접 시작
  const handleStart = async () => {
    setError("");

    if (mode === MODE.LLM) {
      if (selectedCategories.length === 0) {
        setError("카테고리를 최소 1개 선택해주세요.");
        return;
      }

      setLoading(true);
      try {
        const session = await createLlmSession({
          selectedCategories,
          questionCount,
        });
        // 세션 정보를 state로 넘기고 장치 설정 페이지로 이동
        navigate("/interview/device-check", { state: { session } });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
        );
      } finally {
        setLoading(false);
      }
    } else if (mode === MODE.MANUAL) {
      const validQuestions = manualQuestions.filter((q) =>
        q.questionText.trim(),
      );
      if (validQuestions.length === 0) {
        setError("질문을 최소 1개 입력해주세요.");
        return;
      }
      const missingCategory = validQuestions.some((q) => !q.categoryId);
      if (missingCategory) {
        setError("모든 질문에 카테고리를 선택해주세요.");
        return;
      }

      setLoading(true);
      try {
        const session = await createManualSession({
          questions: validQuestions.map((q) => ({
            categoryId: q.categoryId,
            questionText: q.questionText.trim(),
          })),
        });
        navigate("/interview/device-check", { state: { session } });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
        );
      } finally {
        setLoading(false);
      }
    } else {
      // 스크랩 - 추후 구현
      setError("질문 불러오기는 준비 중입니다.");
    }
  };

  return (
    <div className="in-page">
      <Navbar />
      <div className="in-container">
        <h1 className="in-title">면접 세션 만들기</h1>
        <p className="in-subtitle">어떤 방식으로 면접을 준비하시겠어요?</p>

        {/* 질문 구성 방식 선택 */}
        <section className="in-section">
          <p className="in-section-label">질문지 구성 방식</p>
          <div className="in-mode-cards">
            <button
              className={`in-mode-card ${mode === MODE.LLM ? "active" : ""}`}
              onClick={() => setMode(MODE.LLM)}
            >
              <strong>질문 생성</strong>
              <span>
                내가 선택한 직무를 기반으로
                <br />
                AlgoTalk이 질문을 자동으로 생성해 줍니다!
              </span>
            </button>
            <button
              className={`in-mode-card ${mode === MODE.MANUAL ? "active" : ""}`}
              onClick={() => setMode(MODE.MANUAL)}
            >
              <strong>직접 입력</strong>
              <span>
                원하는 CS 및 직무 질문을
                <br />
                직접 입력해보세요!
              </span>
            </button>
            <button
              className={`in-mode-card ${mode === MODE.SCRAP ? "active" : ""}`}
              onClick={() => setMode(MODE.SCRAP)}
            >
              <strong>질문 불러오기</strong>
              <span>
                스크랩한 질문을
                <br />
                불러와서 사용해 보세요!
              </span>
            </button>
          </div>
        </section>

        {/* LLM 모드 */}
        {mode === MODE.LLM && (
          <>
            <section className="in-section">
              <p className="in-section-label">
                카테고리 선택 <span className="in-section-sub">(최대 3개)</span>
              </p>

              {/* 직무 공통 */}
              <p className="in-category-group-label">직무 공통</p>
              <div className="in-chips">
                {commonCategories.map((c) => {
                  const isSelected = selectedCategories.some(
                    (s) => s.categoryId === c.categoryId,
                  );
                  const isDisabled =
                    !isSelected && selectedCategories.length >= 3;
                  return (
                    <button
                      key={c.categoryId}
                      className={`in-chip ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                      onClick={() => toggleCategory(c.categoryId, "COMMON_CS")}
                      disabled={isDisabled}
                    >
                      {c.categoryName}
                    </button>
                  );
                })}
              </div>

              {/* 직무 특화 */}
              <p className="in-category-group-label">직무 특화</p>
              <div className="in-job-section">
                {jobCategories.map((cat) => (
                  <div key={cat.categoryId} className="in-job-group">
                    <p className="in-job-group-label">{cat.categoryName}</p>
                    <div className="in-chips">
                      {jobSubCategories
                        .filter((sub) => sub.parentId === cat.categoryId)
                        .map((sub) => {
                          const isSelected = selectedCategories.some(
                            (s) => s.categoryId === sub.categoryId,
                          );
                          const isDisabled =
                            !isSelected && selectedCategories.length >= 3;
                          return (
                            <button
                              key={sub.categoryId}
                              className={`in-chip ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                              onClick={() =>
                                toggleCategory(sub.categoryId, "JOB")
                              }
                              disabled={isDisabled}
                            >
                              {sub.categoryName}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 질문 수 */}
            <section className="in-section">
              <p className="in-section-label">질문 수</p>
              <div className="in-chips">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`in-chip ${questionCount === n ? "selected" : ""}`}
                    onClick={() => setQuestionCount(n)}
                  >
                    {n}개
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* 직접입력 모드 */}
        {mode === MODE.MANUAL && (
          <section className="in-section">
            <p className="in-section-label">
              질문지 입력 <span className="in-section-sub">(최대 5개)</span>
            </p>
            <div className="in-manual-list">
              {manualQuestions.map((q, idx) => (
                <div key={q.id} className="in-manual-card">
                  <div className="in-manual-card-header">
                    <span className="in-manual-card-title">
                      질문 #{idx + 1}
                    </span>
                    <button
                      className="in-manual-delete"
                      onClick={() => removeManualQuestion(q.id)}
                    >
                      x 삭제
                    </button>
                  </div>

                  {/* 카테고리 선택 */}
                  <div className="in-manual-field">
                    <label className="in-manual-label">카테고리</label>
                    <select
                      className="in-manual-select"
                      value={q.categoryId || ""}
                      onChange={(e) => {
                        const selected = [
                          ...commonCategories,
                          ...jobSubCategories,
                        ].find((c) => c.categoryId === Number(e.target.value));
                        updateManualQuestion(q.id, {
                          categoryId: selected?.categoryId || null,
                          categoryName: selected?.categoryName || "",
                        });
                      }}
                    >
                      <option value="">카테고리 선택</option>
                      <optgroup label="직무 공통">
                        {commonCategories.map((c) => (
                          <option key={c.categoryId} value={c.categoryId}>
                            {c.categoryName}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="직무 특화">
                        {jobSubCategories.map((c) => (
                          <option key={c.categoryId} value={c.categoryId}>
                            {c.categoryName}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* 질문 입력 */}
                  <textarea
                    className="in-manual-textarea"
                    placeholder="질문지를 입력해 주세요."
                    value={q.questionText}
                    onChange={(e) =>
                      updateManualQuestion(q.id, {
                        questionText: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>
              ))}
            </div>

            {manualQuestions.length < 5 && (
              <button className="in-add-btn" onClick={addManualQuestion}>
                + 이력 추가
              </button>
            )}
          </section>
        )}

        {/* 스크랩 모드 */}
        {mode === MODE.SCRAP && (
          <section className="in-section">
            <p style={{ color: "#aaa", fontSize: "0.875rem" }}>
              준비 중입니다.
            </p>
          </section>
        )}

        {/* 에러 메시지 */}
        {error && <p className="in-error">{error}</p>}

        {/* 면접 시작 버튼 */}
        <div className="in-footer">
          <button
            className="in-start-btn"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? "세션 생성 중..." : "면접 시작"}
          </button>
        </div>
      </div>
    </div>
  );
}
