import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import useAuthStore from '../../store/authStore'
import { fetchDashboard } from '../../api/dashboardApi'
import { ArrowRight, BarChart2, CalendarDays, ClipboardList, Mic, Sparkles, Target, TrendingUp, Trophy } from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts'

const PAGE_SIZE = 5

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    useEffect(() => {
        let isCurrentPage = true

        const loadDashboard = async () => {
            setLoading(true)
            try {
                const data = await fetchDashboard(page, PAGE_SIZE)
                if (isCurrentPage) setDashboard(data)
            } catch (e) {
                console.error(e)
            } finally {
                if (isCurrentPage) setLoading(false)
            }
        }

        loadDashboard()

        return () => {
            isCurrentPage = false
        }
    }, [page])

    const totalPages = Math.ceil((dashboard?.totalCount || 0) / PAGE_SIZE)

    const getPageNumbers = () => {
        const range = []
        const delta = 2
        const left = Math.max(1, page - delta)
        const right = Math.min(totalPages, page + delta)
        if (left > 1) range.push(1)
        if (left > 2) range.push('...')
        for (let i = left; i <= right; i++) range.push(i)
        if (right < totalPages - 1) range.push('...')
        if (right < totalPages) range.push(totalPages)
        return range
    }

    if (loading) return (
        <div className="dash-page">
            <Navbar />
            <div className="dash-loading">로딩 중...</div>
        </div>
    )

    const isEmpty = !dashboard || dashboard.totalSessions === 0

    // 항목별 평균 순서: 답변내용 → 시선 → 제스처 → 말하기 속도 → 목소리
    const scoreItems = [
        { label: '답변 내용', key: 'content', max: 25, color: '#5c6bc0' },
        { label: '시선 분석', key: 'gaze',    max: 25, color: '#ffa726' },
        { label: '자세·제스처', key: 'gesture', max: 20, color: '#42a5f5' },
        { label: '말하기 속도', key: 'speed',   max: 15, color: '#ec407a' },
        { label: '목소리',   key: 'voice',   max: 15, color: '#26a69a' },
    ]

    // 차트 데이터: 날짜 기반 - 오래된 순으로 정렬
    const chartData = (dashboard?.scoreHistory || [])
        .slice()
        .reverse()
        .map(s => ({
            ...s,
            date: s.completedAt?.slice(0, 10) || '',
        }))

    return (
        <div className="dash-page">
            <Navbar />
            <section className="dash-hero">
                <div>
                    <span className="dash-eyebrow"><Sparkles size={14} /> INTERVIEW REPORT</span>
                    <h1>연습의 변화를<br />데이터로 확인하세요.</h1>
                    <p>면접 기록과 항목별 피드백을 통해 다음 답변의 방향을 찾아보세요.</p>
                </div>
                <div className="dash-hero-visual" aria-hidden="true">
                    <TrendingUp size={28} />
                    <span className="dash-hero-line"><i /><i /><i /><i /><i /></span>
                    <strong>꾸준히 성장하고 있어요</strong>
                </div>
            </section>
            <div className="dash-container">

                {isEmpty ? (
                    /* ── 빈 상태 ── */
                    <div className="dash-empty">
                        <div className="dash-empty-icon"><ClipboardList size={30} /></div>
                        <h2 className="dash-empty-title">
                            아직 {user?.nickname} 님의 면접 기록이 없어요
                        </h2>
                        <p className="dash-empty-desc">
                            첫 번째 모의 면접을 시작해보세요.<br />
                            CS 기술 질문으로 실전 감각을 익히고<br />
                            상세한 피드백 리포트를 받아볼 수 있어요!
                        </p>
                        <button
                            className="dash-empty-btn"
                            onClick={() => navigate('/interview')}
                        >
                            첫 면접 시작하기 <ArrowRight size={17} />
                        </button>
                        <div className="dash-steps">
                            <div className="dash-step">
                                <div className="dash-step-icon" style={{ background: '#ede7f6' }}>
                                    <Target size={28} strokeWidth={1.5} color="#5c6bc0" />
                                </div>
                                <div className="dash-step-title">질문 구성</div>
                                <div className="dash-step-desc">AI가 맞춤 CS 질문을 생성해요</div>
                            </div>
                            <div className="dash-step">
                                <div className="dash-step-icon" style={{ background: '#fce4ec' }}>
                                    <Mic size={28} strokeWidth={1.5} color="#ec407a" />
                                </div>
                                <div className="dash-step-title">면접 진행</div>
                                <div className="dash-step-desc">카메라와 마이크로 실제처럼 면접하고 AI가 답변을 분석해요</div>
                            </div>
                            <div className="dash-step">
                                <div className="dash-step-icon" style={{ background: '#e0f2f1' }}>
                                    <BarChart2 size={28} strokeWidth={1.5} color="#26a69a" />
                                </div>
                                <div className="dash-step-title">리포트 확인</div>
                                <div className="dash-step-desc">답변 점수, 피드백, 모범 답변을 확인해요</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 헤더 */}
                        <div className="dash-header">
                            <h2 className="dash-greeting">
                                <strong>{user?.nickname}</strong> 님의&nbsp;
                                <strong>면접 기록</strong>
                            </h2>
                            <button
                                className="dash-start-btn"
                                onClick={() => navigate('/interview')}
                            >
                                면접 시작하기 <ArrowRight size={17} />
                            </button>
                        </div>

                        {/* 통계 카드 */}
                        <div className="dash-cards">
                            <div className="dash-card dash-card--sessions">
                                <div className="dash-card-icon"><CalendarDays size={19} /></div>
                                <div><div className="dash-card-label">총 세션 수</div><div className="dash-card-value">{dashboard.totalSessions}<small>회</small></div></div>
                            </div>
                            <div className="dash-card dash-card--average">
                                <div className="dash-card-icon"><TrendingUp size={19} /></div>
                                <div><div className="dash-card-label">평균 점수</div><div className="dash-card-value">{dashboard.avgScore?.toFixed(1)}<small>점</small></div></div>
                            </div>
                            <div className="dash-card dash-card--best">
                                <div className="dash-card-icon"><Trophy size={19} /></div>
                                <div><div className="dash-card-label">최고 점수</div><div className="dash-card-value">{dashboard.maxScore?.toFixed(1)}<small>점</small></div></div>
                            </div>
                        </div>

                        <div className="dash-main">
                            {/* 점수 추이 차트 */}
                            <div className="dash-chart-wrap">
                                <h3 className="dash-section-title"><TrendingUp size={17} /> 점수 추이</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 11, fill: '#aaa' }}
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            tick={{ fontSize: 11, fill: '#aaa' }}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`${value}점`, '평균 점수']}
                                            labelFormatter={(date) => {
                                                const s = chartData.find(h => h.date === date)
                                                return s?.sessionTitle || date
                                            }}
                                            contentStyle={{
                                                borderRadius: 8,
                                                border: '1.5px solid #e8e8e8',
                                                fontSize: '0.82rem',
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="avgScore"
                                            stroke="#5c6bc0"
                                            strokeWidth={2.5}
                                            dot={{ r: 4, fill: '#5c6bc0', strokeWidth: 0 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* 항목별 평균 */}
                            <div className="dash-detail-wrap">
                                <h3 className="dash-section-title"><BarChart2 size={17} /> 항목별 평균</h3>
                                <div className="dash-detail-list">
                                    {scoreItems.map(item => {
                                        const score = dashboard.scoreDetails?.[item.key] ?? 0
                                        const pct = Math.round((score / item.max) * 100)
                                        return (
                                            <div key={item.key} className="dash-detail-item">
                                                <div className="dash-detail-header">
                                                    <span className="dash-detail-label">{item.label}</span>
                                                    <span className="dash-detail-score">
                                                        {score.toFixed(1)} / {item.max}
                                                    </span>
                                                </div>
                                                <div className="dash-detail-bar-bg">
                                                    <div
                                                        className="dash-detail-bar"
                                                        style={{ width: `${pct}%`, background: item.color }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 최근 세션 목록 */}
                        <div className="dash-sessions">
                            <h3 className="dash-section-title"><ClipboardList size={17} /> 면접 세션 <span>{dashboard.totalCount ?? dashboard.recentSessions.length}개의 기록</span></h3>
                            <div className="dash-session-list">
                                {dashboard.recentSessions.map(session => {
                                    const score = session.avgScore ?? 0
                                    const grade = score >= 70
                                        ? { text: '우수', color: '#4caf50' }
                                        : score >= 40
                                        ? { text: '보통', color: '#ff9800' }
                                        : { text: '미흡', color: '#e57373' }
                                    return (
                                        <div
                                            key={session.sessionId}
                                            className="dash-session-item"
                                            onClick={() => navigate(`/interview/result/${session.sessionId}`)}
                                        >
                                            <div className="dash-session-info">
                                                <div className="dash-session-title">{session.sessionTitle}</div>
                                                <div className="dash-session-meta">
                                                    {session.completedAt?.slice(0, 10)} · {session.totalQuestions}문항
                                                </div>
                                            </div>
                                            <div className="dash-session-right">
                                                <span
                                                    className="dash-session-badge"
                                                    style={{
                                                        background: grade.color + '1a',
                                                        color: grade.color,
                                                        borderColor: grade.color + '40',
                                                    }}
                                                >
                                                    {grade.text}
                                                </span>
                                                <span className="dash-session-score">
                                                    {(session.avgScore ?? 0).toFixed(1)}점
                                                </span>
                                                <span className="dash-session-arrow">›</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* 페이징 */}
                            {totalPages > 1 && (
                                <div className="dash-paging">
                                    <button onClick={() => setPage(1)} disabled={page === 1}>{'<<'}</button>
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{'<'}</button>
                                    {getPageNumbers().map((p, i) =>
                                        p === '...'
                                            ? <span key={`e-${i}`} className="dash-page-ellipsis">...</span>
                                            : <button
                                                key={p}
                                                className={page === p ? 'active' : ''}
                                                onClick={() => setPage(p)}
                                            >{p}</button>
                                    )}
                                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>{'>'}</button>
                                    <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>{'>>'}</button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}