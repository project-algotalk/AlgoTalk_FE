import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { fetchPostDetail, createPost, updatePost } from '../../api/boardApi'
import { fetchCategories } from '../../api/csCategoryApi'
import useAuthStore from '../../store/authStore'
import AlertModal from '../../components/common/AlertModal'
import './BoardWritePage.css'

const BOARD_CATEGORIES = [
    { label: '질문공유', categoryId: 1, categoryCd: 'QUESTION' },
    { label: '정보·팁', categoryId: 2, categoryCd: 'INFO' },
    { label: '후기', categoryId: 3, categoryCd: 'REVIEW' },
    { label: '자유', categoryId: 4, categoryCd: 'FREE' },
]

export default function BoardWritePage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const editPostId = searchParams.get('edit')
    const isEdit = !!editPostId

    // 폼 상태
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [hashtagInput, setHashtagInput] = useState('')
    const [hashtags, setHashtags] = useState([])

    // CS 카테고리
    const [csCategories, setCsCategories] = useState([])
    const [selectedDepth1Id, setSelectedDepth1Id] = useState(null)
    const [selectedDepth2Id, setSelectedDepth2Id] = useState(null)

    // 모달
    const [alertModal, setAlertModal] = useState({ open: false, message: '', type: 'error' })

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchCategories()
            .then(setCsCategories)
            .catch(console.error)
    }, [])

    // 수정 모드: 기존 데이터 로드
    useEffect(() => {
        if (!isEdit) return
        fetchPostDetail(editPostId).then(post => {
            setSelectedCategoryId(post.categoryId)
            setTitle(post.title)
            setContent(post.content)
            setHashtags(post.hashtags || [])
            if (post.csCategoryId) {
                // depth 찾기
                const depth2 = csCategories.find(c => c.categoryId === post.csCategoryId)
                if (depth2?.depth === 2) {
                    setSelectedDepth2Id(post.csCategoryId)
                    setSelectedDepth1Id(depth2.parentId)
                } else if (depth2?.depth === 1) {
                    setSelectedDepth1Id(post.csCategoryId)
                }
            }
        }).catch(console.error)
    }, [isEdit, editPostId, csCategories])

    // CS 카테고리 파싱
    const commonChildren = csCategories.filter(c => c.depth === 1 && c.categoryType === 'COMMON_CS')
    const jobChildren = csCategories.filter(c =>
        c.depth === 1 && c.categoryType === 'JOB' && c.categoryName !== '기타(직접입력)'
    )
    const subChildren = csCategories.filter(c => c.depth === 2 && c.parentId === selectedDepth1Id)

    const handleCategorySelect = (categoryId) => {
        setSelectedCategoryId(categoryId)
        // 질문공유(1)가 아니면 CS 카테고리 초기화
        if (categoryId !== 1) {
            setSelectedDepth1Id(null)
            setSelectedDepth2Id(null)
        }
    }

    const handleDepth1Click = (categoryId) => {
        if (selectedDepth1Id === categoryId) {
            setSelectedDepth1Id(null)
            setSelectedDepth2Id(null)
        } else {
            setSelectedDepth1Id(categoryId)
            setSelectedDepth2Id(null)
        }
    }

    const handleDepth2Click = (categoryId) => {
        setSelectedDepth2Id(prev => prev === categoryId ? null : categoryId)
    }

    // 해시태그 입력
    const handleHashtagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const tag = hashtagInput.trim().replace(/^#/, '')
            if (tag && !hashtags.includes(tag) && hashtags.length < 5) {
                setHashtags(prev => [...prev, tag])
            }
            setHashtagInput('')
        }
    }

    const handleRemoveHashtag = (tag) => {
        setHashtags(prev => prev.filter(t => t !== tag))
    }

    // 등록/수정
    const handleSubmit = async () => {
        if (!selectedCategoryId) {
            setAlertModal({ open: true, message: '유형을 선택하세요.', type: 'error' })
            return
        }
        if (!title.trim()) {
            setAlertModal({ open: true, message: '제목을 입력하세요.', type: 'error' })
            return
        }
        // 질문공유일 때 카테고리 필수 체크
        if (selectedCategoryId === 1 && !selectedDepth1Id) {
            setAlertModal({ open: true, message: '카테고리를 선택하세요.', type: 'error' })
            return
        }
        // 직무 특화 선택 시 세부 카테고리 필수 체크
        if (selectedCategoryId === 1 && selectedDepth1Id) {
            const isJobCategory = jobChildren.some(c => c.categoryId === selectedDepth1Id)
            if (isJobCategory && !selectedDepth2Id) {
                setAlertModal({ open: true, message: '직무 특화 세부 카테고리를 선택하세요.', type: 'error' })
                return
            }
        }
        if (!content.trim()) {
            setAlertModal({ open: true, message: '내용을 입력하세요.', type: 'error' })
            return
        }

        const activeCsCategoryId = selectedDepth2Id || selectedDepth1Id || null

        const payload = {
            categoryId: selectedCategoryId,
            title: title.trim(),
            content: content.trim(),
            csCategoryId: activeCsCategoryId,
            hashtags,
        }

        setLoading(true)
        try {
            if (isEdit) {
                await updatePost(editPostId, payload)
                navigate(`/board/${editPostId}`)
            } else {
                const postId = await createPost(payload)
                navigate(`/board/${postId}`)
            }
        } catch (e) {
            console.error(e)
            const errorMessage = e.response?.data?.message || '오류가 발생했습니다. 다시 시도해주세요.'
            setAlertModal({ open: true, message: errorMessage, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="board-write-wrap">
            <Navbar />
            <div className="board-write-container">

                {/* 헤더 */}
                <div className="board-write-header">
                    <button className="board-write-back" onClick={() => navigate(-1)}>&lt;</button>
                    <h2 className="board-write-title-header">AlgoTalk</h2>
                    <button
                        className="board-write-submit-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? '처리중...' : '등록'}
                    </button>
                </div>

                <div className="board-write-body">
                    <h3 className="board-write-section-title">글쓰기</h3>

                    {/* 유형 선택 */}
                    <div className="board-write-field">
                        <label className="board-write-label">유형 <span className="required">*</span></label>
                        <div className="board-write-type-btns">
                            {BOARD_CATEGORIES.map(cat => (
                                <button
                                    key={cat.categoryId}
                                    className={`board-write-type-btn ${selectedCategoryId === cat.categoryId ? 'active' : ''}`}
                                    onClick={() => handleCategorySelect(cat.categoryId)}                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 제목 */}
                    <div className="board-write-field">
                        <label className="board-write-label">제목 <span className="required">*</span></label>
                        <input
                            className="board-write-input"
                            placeholder="받은 면접 질문을 그대로 작성하세요."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            maxLength={200}
                        />
                    </div>

                    {/* CS 카테고리 */}
                    {selectedCategoryId === 1 && (
                    <div className="board-write-field">
                            <label className="board-write-label">
                                카테고리 <span className="required">*</span>
                            </label>
                            <div className="board-write-filter-wrap">
                            <div className="board-write-filter-row">
                                <span className="board-write-filter-label">직무 공통</span>
                                <div className="board-write-filter-btns">
                                    {commonChildren.map(c => (
                                        <button
                                            key={c.categoryId}
                                            className={`board-write-filter-btn ${selectedDepth1Id === c.categoryId ? 'active' : ''}`}
                                            onClick={() => handleDepth1Click(c.categoryId)}
                                        >
                                            {c.categoryName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="board-write-filter-row">
                                <span className="board-write-filter-label">직무 특화</span>
                                <div className="board-write-filter-btns">
                                    {jobChildren.map(c => (
                                        <button
                                            key={c.categoryId}
                                            className={`board-write-filter-btn ${selectedDepth1Id === c.categoryId ? 'active' : ''}`}
                                            onClick={() => handleDepth1Click(c.categoryId)}
                                        >
                                            {c.categoryName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {subChildren.length > 0 && (
                                <div className="board-write-filter-row board-write-filter-sub">
                                    <span className="board-write-filter-label">세부</span>
                                    <div className="board-write-filter-btns">
                                        {subChildren.map(c => (
                                            <button
                                                key={c.categoryId}
                                                className={`board-write-filter-btn ${selectedDepth2Id === c.categoryId ? 'active' : ''}`}
                                                onClick={() => handleDepth2Click(c.categoryId)}
                                            >
                                                {c.categoryName}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    )}

                    {/* 내용 */}
                    <div className="board-write-field">
                        <label className="board-write-label">내용 <span className="required">*</span></label>
                        <textarea
                            className="board-write-textarea"
                            placeholder="내용을 입력하세요."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>

                    {/* 해시태그 */}
                    <div className="board-write-field">
                        <label className="board-write-label">해시태그</label>
                        <div className="board-write-hashtag-wrap">
                            {hashtags.map(tag => (
                                <span key={tag} className="board-write-hashtag">
                                    #{tag}
                                    <button onClick={() => handleRemoveHashtag(tag)}>×</button>
                                </span>
                            ))}
                            {hashtags.length < 5 && (
                                <input
                                    className="board-write-hashtag-input"
                                    placeholder="태그 입력 후 Enter"
                                    value={hashtagInput}
                                    onChange={e => setHashtagInput(e.target.value)}
                                    onKeyDown={handleHashtagKeyDown}
                                />
                            )}
                        </div>
                    </div>

                    {/* 하단 등록 버튼 */}
                    <div className="board-write-footer">
                        <button
                            className="board-write-submit-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? '처리중...' : '등록'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 알림 모달 */}
            {alertModal.open && (
                <AlertModal
                    type={alertModal.type}
                    message={alertModal.message}
                    onConfirm={() => setAlertModal({ open: false, message: '', type: 'error' })}
                    onClose={() => setAlertModal({ open: false, message: '', type: 'error' })}
                />
            )}
        </div>
    )
}