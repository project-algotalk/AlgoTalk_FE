const STEPS = {
    session: [
        { label: "카테고리 분석 중", status: "done" },
        { label: "AI 질문 생성 중...", status: "active" },
        { label: "면접 세션 준비", status: "wait" },
    ],
    result: [
        { label: "음성 데이터 처리 완료", status: "done" },
        { label: "시선 · 자세 분석 완료", status: "done" },
        { label: "AI 답변 평가 중...", status: "active" },
        { label: "결과 리포트 생성", status: "wait" },
    ],
};

export default function AnalyzingLoader({ type = "result" }) {
    const steps = STEPS[type];
    const titles = {
        session: "면접 세션 생성 중입니다",
        result: "면접 분석 중입니다",
    };
    const subs = {
        session: "AI가 맞춤 질문을 생성하고 있습니다.\n잠시만 기다려 주세요.",
        result: "답변 영상을 분석하고 있습니다.\n평균 1 ~ 2분 소요됩니다.",
    };

    return (
        <div className="al-wrap">
            <div className="al-spinner" />
            <p className="al-title">{titles[type]}</p>
            <p className="al-sub">{subs[type].split("\n").map((line, i) => (
                <span key={i}>{line}<br /></span>
            ))}</p>
            <div className="al-steps">
                {steps.map((step, i) => (
                    <div key={i} className="al-step">
                        <div className={`al-step-icon ${step.status}`}>
                            {step.status === "done"
                                ? <i className="ti ti-check" aria-hidden="true" />
                                : step.status === "active"
                                    ? <i className="ti ti-brain" aria-hidden="true" />
                                    : <i className="ti ti-report-analytics" aria-hidden="true" />
                            }
                        </div>
                        <span className={`al-step-label ${step.status}`}>{step.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}