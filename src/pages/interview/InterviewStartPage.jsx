import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import AlertModal from "../../components/common/AlertModal";
import ScrapSelectModal from '../../components/interview/ScrapSelectModal'
import AnalyzingLoader from "../../components/common/AnalyzingLoader";
import {
  fetchCsCategories,
  createLlmSession,
  createManualSession,
} from "../../api/interviewApi";
import { fetchTargetJobs } from "../../api/myPageApi";
import "./InterviewStartPage.css";

const MODE = {
  LLM: "llm",
  MANUAL: "manual",
  SCRAP: "scrap",
};

export default function InterviewStartPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState(MODE.LLM);
  const [commonCategories, setCommonCategories] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [jobSubCategories, setJobSubCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [questionCount, setQuestionCount] = useState(3);
  const [scrapQuestions, setScrapQuestions] = useState([])
  const [showScrapModal, setShowScrapModal] = useState(false)
  const [loadingMyInfo, setLoadingMyInfo] = useState(false);
  const [manualQuestions, setManualQuestions] = useState([
    { id: Date.now(), categoryId: null, categoryName: "", questionText: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(null);
  const [categoryError, setCategoryError] = useState("");
  const [questionErrors, setQuestionErrors] = useState({});

  useEffect(() => {
    fetchCsCategories().then((data) => {
      const common = data
        .filter((c) => c.categoryType === "COMMON_CS" && c.depth === 1)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      setCommonCategories(common);

      const jobDepth1 = data
        .filter(
          (c) =>
            c.categoryType === "JOB" && c.depth === 1 && c.categoryId !== 24
        )
        .sort((a, b) => a.sortOrder - b.sortOrder);
      setJobCategories(jobDepth1);

      const jobDepth2 = data
        .filter((c) => c.categoryType === "JOB" && c.depth === 2)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      setJobSubCategories(jobDepth2);
    });
  }, []);

  const handleLoadMyInfo = async () => {
    setLoadingMyInfo(true);
    setErrorModal(null);
    try {
      const targetJobs = await fetchTargetJobs();
      if (!targetJobs || targetJobs.length === 0) {
        setErrorModal({
          message:
            "등록된 목표 직무가 없습니다. 마이페이지에서 목표 직무를 설정해주세요.",
        });
        return;
      }
      const newSelections = [...selectedCategories];
      for (const job of targetJobs) {
        const alreadySelected = newSelections.some(
          (s) => s.categoryId === job.categoryId
        );
        if (!alreadySelected && newSelections.length < 3) {
          newSelections.push({ categoryId: job.categoryId, categoryType: "JOB" });
        }
      }
      setSelectedCategories(newSelections);
      setCategoryError("");
    } catch {
      setErrorModal({ message: "내 정보를 불러오는데 실패했습니다." });
    } finally {
      setLoadingMyInfo(false);
    }
  };

  const toggleCategory = (categoryId, categoryType) => {
    setCategoryError("");
    const isSelected = selectedCategories.some(
      (c) => c.categoryId === categoryId
    );
    if (isSelected) {
      setSelectedCategories((prev) =>
        prev.filter((c) => c.categoryId !== categoryId)
      );
    } else {
      if (selectedCategories.length >= 3) return;
      setSelectedCategories((prev) => [...prev, { categoryId, categoryType }]);
    }
  };

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
    setQuestionErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateManualQuestion = (id, updates) => {
    setQuestionErrors((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...Object.keys(updates).reduce((acc, k) => ({ ...acc, [k]: "" }), {}),
      },
    }));
    setManualQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const handleStart = async () => {
    setErrorModal(null);
    setCategoryError("");
    setQuestionErrors({});

    if (mode === MODE.LLM) {
      if (selectedCategories.length === 0) {
        setCategoryError("카테고리를 최소 1개 선택해주세요.");
        return;
      }
      setLoading(true);
      try {
        const session = await createLlmSession({ selectedCategories, questionCount });
        navigate("/interview/device-check", { state: { session } });
      } catch (err) {
        setErrorModal({
          message:
            err.response?.data?.message ||
            "세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
        });
      } finally {
        setLoading(false);
      }
    } else if (mode === MODE.MANUAL) {
      const errs = {};
      manualQuestions.forEach((q) => {
        const cardErr = {};
        if (!q.categoryId) cardErr.categoryId = "카테고리를 선택해주세요.";
        if (!q.questionText.trim()) cardErr.questionText = "질문을 입력해주세요.";
        if (Object.keys(cardErr).length > 0) errs[q.id] = cardErr;
      });

      if (Object.keys(errs).length > 0) {
        setQuestionErrors(errs);
        return;
      }

      setLoading(true);
      try {
        const session = await createManualSession({
          questions: manualQuestions.map((q) => ({
            categoryId: q.categoryId,
            questionText: q.questionText.trim(),
          })),
        });
        navigate("/interview/device-check", { state: { session } });
      } catch (err) {
        setErrorModal({
          message:
            err.response?.data?.message ||
            "세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
        });
      } finally {
        setLoading(false);
      }
    } else if (mode === MODE.SCRAP) {
      if (scrapQuestions.length === 0) {
        setErrorModal({ message: '질문을 불러오세요.' })
        return
      }
      setLoading(true)
      try {
        const session = await createManualSession({
          questions: scrapQuestions.map(q => ({
            categoryId: q.csCategoryId,
            questionText: q.title,
          }))
        })
        navigate('/interview/device-check', { state: { session } })
      } catch (err) {
        setErrorModal({
          message: err.response?.data?.message || '세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.',
        })
      } finally {
        setLoading(false)
      }
    }
  };

  const handleScrapConfirm = (selectedScraps) => {
    const merged = [...scrapQuestions]
    for (const s of selectedScraps) {
      if (!merged.some(q => q.postId === s.postId) && merged.length < 5) {
        merged.push(s)
      }
    }
    setScrapQuestions(merged)
    setShowScrapModal(false)
  }

  if (loading) return (
    <div className="in-page">
      <Navbar />
      <AnalyzingLoader type="session" />
    </div>
  );

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
                카테고리 선택{" "}
                <span className="in-section-sub">(최대 3개)</span>
              </p>

              <p className="in-category-group-label">직무 공통</p>
              <div className="in-chips">
                {commonCategories.map((c) => {
                  const isSelected = selectedCategories.some(
                    (s) => s.categoryId === c.categoryId
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

              {categoryError && (
                <p className="in-field-error">{categoryError}</p>
              )}

              <div className="in-category-group-header">
                <p className="in-category-group-label">직무 특화</p>
                <button
                  className="in-load-my-info-btn"
                  onClick={handleLoadMyInfo}
                  disabled={loadingMyInfo}
                >
                  {loadingMyInfo ? "불러오는 중..." : "+ 내 정보 불러오기"}
                </button>
              </div>
              <div className="in-job-section">
                {jobCategories.map((cat) => (
                  <div key={cat.categoryId} className="in-job-group">
                    <p className="in-job-group-label">{cat.categoryName}</p>
                    <div className="in-chips">
                      {jobSubCategories
                        .filter((sub) => sub.parentId === cat.categoryId)
                        .map((sub) => {
                          const isSelected = selectedCategories.some(
                            (s) => s.categoryId === sub.categoryId
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
              질문지 입력{" "}
              <span className="in-section-sub">(최대 5개)</span>
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

                  <div className="in-manual-field">
                    <label className="in-manual-label">카테고리</label>
                    <select
                      className={`in-manual-select ${questionErrors[q.id]?.categoryId ? "error" : ""}`}
                      value={q.categoryId || ""}
                      onChange={(e) => {
                        const selected = [
                          ...commonCategories,
                          ...jobSubCategories,
                        ].find(
                          (c) => c.categoryId === Number(e.target.value)
                        );
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
                    {questionErrors[q.id]?.categoryId && (
                      <p className="in-field-error">
                        {questionErrors[q.id].categoryId}
                      </p>
                    )}
                  </div>

                  <textarea
                    className={`in-manual-textarea ${questionErrors[q.id]?.questionText ? "error" : ""}`}
                    placeholder="질문지를 입력해 주세요."
                    value={q.questionText}
                    onChange={(e) =>
                      updateManualQuestion(q.id, {
                        questionText: e.target.value,
                      })
                    }
                    rows={2}
                  />
                  {questionErrors[q.id]?.questionText && (
                    <p className="in-field-error">
                      {questionErrors[q.id].questionText}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {manualQuestions.length < 5 && (
              <button className="in-add-btn" onClick={addManualQuestion}>
                + 질문 추가
              </button>
            )}
          </section>
        )}

        {/* 스크랩 모드 */}
        {mode === MODE.SCRAP && (
          <section className="in-section">
            <p className="in-section-label">
              질문지 <span className="in-section-sub">(최대 5개)</span>
            </p>
            <div className="in-manual-list">
              {scrapQuestions.map((q, idx) => (
                <div key={q.postId} className="in-manual-card">
                  <div className="in-manual-card-header">
                    <span className="in-manual-card-title">질문 #{idx + 1}</span>
                    <button
                      className="in-manual-delete"
                      onClick={() => setScrapQuestions(prev =>
                        prev.filter(s => s.postId !== q.postId)
                      )}
                    >
                      x 삭제
                    </button>
                  </div>
                  <div style={{
                    padding: '10px 12px',
                    fontSize: '0.875rem',
                    color: '#333',
                    background: '#fafafa',
                    border: '1.5px solid #e0e0e0',
                    borderRadius: '8px',
                    lineHeight: '1.5',
                  }}>
                    {q.title}
                  </div>
                </div>
              ))}
            </div>

            {scrapQuestions.length < 5 && (
              <button
                className="in-add-btn"
                onClick={() => setShowScrapModal(true)}
              >
                + 불러오기
              </button>
            )}
          </section>
        )}

        <div className="in-footer">
          <button
            className="in-start-btn"
            onClick={handleStart}
            disabled={loading}
          >
            면접 시작
          </button>
        </div>
      </div>

      {/* 에러 모달 */}
      {errorModal && (
        <AlertModal
          type="error"
          align="center"
          message={errorModal.message}
          onConfirm={() => setErrorModal(null)}
        />
      )}

      {/* 스크랩 모달 */}
      {showScrapModal && (
        <ScrapSelectModal
          onConfirm={handleScrapConfirm}
          onCancel={() => setShowScrapModal(false)}
        />
      )}
    </div>
  );
}