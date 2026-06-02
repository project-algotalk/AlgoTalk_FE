import { useState, useEffect } from 'react'
import { Bookmark, MessageCircle } from 'lucide-react'
import { fetchMyScraps } from '../../api/myPageApi'
import './ScrapSelectModal.css'

const PAGE_SIZE = 10

export default function ScrapSelectModal({ onConfirm, onCancel }) {
    const [scraps, setScraps] = useState([])
    const [selected, setSelected] = useState([])
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadScraps()
    }, [page])

    const loadScraps = async () => {
        setLoading(true)
        try {
            const data = await fetchMyScraps(page, PAGE_SIZE)
            setScraps(data || [])
            setTotalCount(data?.[0]?.totalCount || 0)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const toggleSelect = (scrap) => {
        setSelected(prev => {
            const exists = prev.some(s => s.postId === scrap.postId)
            if (exists) return prev.filter(s => s.postId !== scrap.postId)
            return [...prev, scrap]
        })
    }

    const isSelected = (postId) => selected.some(s => s.postId === postId)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

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

    return (
        <div className="ssm-overlay">
            <div className="ssm-modal">
                <h3 className="ssm-title">스크랩글</h3>

                {loading ? (
                    <div className="ssm-loading">로딩 중...</div>
                ) : scraps.length === 0 ? (
                    <div className="ssm-empty">스크랩한 게시글이 없습니다.</div>
                ) : (
                    <div className="ssm-list">
                        {scraps.map(scrap => (
                            <div
                                key={scrap.postId}
                                className={`ssm-item ${isSelected(scrap.postId) ? 'selected' : ''}`}
                                onClick={() => toggleSelect(scrap)}
                            >
                                <input
                                    type="checkbox"
                                    className="ssm-checkbox"
                                    checked={isSelected(scrap.postId)}
                                    onChange={() => toggleSelect(scrap)}
                                    onClick={e => e.stopPropagation()}
                                />
                                <div className="ssm-item-info">
                                    <div className="ssm-item-title">{scrap.title}</div>
                                    <div className="ssm-item-meta">
                                        {scrap.categoryName} · {scrap.nickname} · {scrap.createdAt?.slice(0, 10)}
                                    </div>
                                </div>
                                <div className="ssm-item-counts">
                                    <span><Bookmark size={12} /> {scrap.scrapCount}</span>
                                    <span><MessageCircle size={12} /> {scrap.commentCount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="ssm-paging">
                        <button onClick={() => setPage(1)} disabled={page === 1}>{'<<'}</button>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{'<'}</button>
                        {getPageNumbers().map((p, i) =>
                            p === '...'
                                ? <span key={`e-${i}`} className="ssm-ellipsis">...</span>
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

                <div className="ssm-footer">
                    <button className="ssm-btn-cancel" onClick={onCancel}>취소</button>
                    <button
                        className="ssm-btn-confirm"
                        onClick={() => onConfirm(selected)}
                        disabled={selected.length === 0}
                    >
                        선택 완료
                    </button>
                </div>
            </div>
        </div>
    )
}