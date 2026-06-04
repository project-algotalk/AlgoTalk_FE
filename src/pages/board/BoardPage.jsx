import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { fetchPostList } from '../../api/boardApi'
import { fetchCategories } from '../../api/csCategoryApi'
import useAuthStore from '../../store/authStore'
import { Heart, Bookmark, MessageCircle, Eye } from 'lucide-react'
import './BoardPage.css'

const TABS = [
    { label: '질문공유', categoryCd: 'QUESTION' },
    { label: '정보·팁', categoryCd: 'INFO' },
    { label: '후기', categoryCd: 'REVIEW' },
    { label: '자유', categoryCd: 'FREE' },
]

const SEARCH_TYPES = [
    { label: '제목+내용', value: 'TITLE_CONTENT' },
    { label: '제목', value: 'TITLE' },
    { label: '내용', value: 'CONTENT' },
    { label: '작성자', value: 'AUTHOR' },
]

const PAGE_SIZE = 10

export default function BoardPage() {
    const navigate = useNavigate()
    const { authStatus } = useAuthStore()

    const [activeTab, setActiveTab] = useState(0)
    const [keyword, setKeyword] = useState('')
    const [searchType, setSearchType] = useState('TITLE_CONTENT')
    const [searchInput, setSearchInput] = useState('')
    const [csCategories, setCsCategories] = useState([])
    const [selectedDepth1Id, setSelectedDepth1Id] = useState(null)
    const [selectedDepth2Id, setSelectedDepth2Id] = useState(null)
    const [posts, setPosts] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchCategories()
            .then(setCsCategories)
            .catch(console.error)
    }, [])

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true)
            try {
                const childIds = csCategories
                    .filter(c => c.parentId === selectedDepth1Id && c.depth === 2)
                    .map(c => c.categoryId)

                const params = {
                    categoryCd: TABS[activeTab].categoryCd,
                    keyword: keyword || undefined,
                    searchType: keyword ? searchType : undefined,
                    ...(selectedDepth2Id
                        ? { csCategoryId: selectedDepth2Id }
                        : selectedDepth1Id && childIds.length > 0
                            ? { csCategoryIds: childIds }
                            : selectedDepth1Id
                                ? { csCategoryId: selectedDepth1Id }
                                : {}),
                    page,
                    size: PAGE_SIZE,
                }
                const result = await fetchPostList(params)
                setPosts(result || [])
                setTotalCount(result?.[0]?.totalCount || 0)
            } catch (e) {
                console.error(e)
                setPosts([])
                setTotalCount(0)
            } finally {
                setLoading(false)
            }
        }

        loadPosts()
    }, [activeTab, keyword, searchType, selectedDepth1Id, selectedDepth2Id, page, csCategories])

    const commonChildren = csCategories.filter(c => c.depth === 1 && c.categoryType === 'COMMON_CS')
    const jobChildren = csCategories.filter(c =>
        c.depth === 1 && c.categoryType === 'JOB' && c.categoryName !== '기타(직접입력)'
    )
    const subChildren = csCategories.filter(c => c.depth === 2 && c.parentId === selectedDepth1Id)

    const handleTabChange = (idx) => {
        setActiveTab(idx)
        setPage(1)
        setSelectedDepth1Id(null)
        setSelectedDepth2Id(null)
    }

    const handleDepth1Click = (categoryId) => {
        if (selectedDepth1Id === categoryId) {
            setSelectedDepth1Id(null)
            setSelectedDepth2Id(null)
        } else {
            setSelectedDepth1Id(categoryId)
            setSelectedDepth2Id(null)
        }
        setPage(1)
    }
    const handleDepth2Click = (categoryId) => {
        setSelectedDepth2Id(prev => prev === categoryId ? null : categoryId)
        setPage(1)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setKeyword(searchInput)
        setPage(1)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch(e)
    }

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
        <div className="board-wrap">
            <Navbar />
            <div className="board-container">

                {/* 탭 */}
                <div className="board-tabs">
                    {TABS.map((tab, idx) => (
                        <button
                            key={tab.categoryCd}
                            className={`board-tab ${activeTab === idx ? 'active' : ''}`}
                            onClick={() => handleTabChange(idx)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 검색 */}
                <div className="board-search-wrap">
                    <select
                        className="board-search-type"
                        value={searchType}
                        onChange={e => setSearchType(e.target.value)}
                    >
                        {SEARCH_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                    <input
                        className="board-search-input"
                        placeholder="검색어를 입력하세요."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="board-search-btn" onClick={handleSearch}>검색</button>
                </div>

                {/* CS 카테고리 필터 */}
                {csCategories.length > 0 && (
                    <div className="board-filter-wrap">
                        <div className="board-filter-row">
                            <span className="board-filter-label">직무 공통</span>
                            <div className="board-filter-btns">
                                {commonChildren.map(c => (
                                    <button
                                        key={c.categoryId}
                                        className={`board-filter-btn ${selectedDepth1Id === c.categoryId ? 'active' : ''}`}
                                        onClick={() => handleDepth1Click(c.categoryId)}
                                    >
                                        {c.categoryName}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="board-filter-row">
                            <span className="board-filter-label">직무 특화</span>
                            <div className="board-filter-btns">
                                {jobChildren.map(c => (
                                    <button
                                        key={c.categoryId}
                                        className={`board-filter-btn ${selectedDepth1Id === c.categoryId ? 'active' : ''}`}
                                        onClick={() => handleDepth1Click(c.categoryId)}
                                    >
                                        {c.categoryName}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {subChildren.length > 0 && (
                            <div className="board-filter-row board-filter-sub">
                                <span className="board-filter-label">세부</span>
                                <div className="board-filter-btns">
                                    {subChildren.map(c => (
                                        <button
                                            key={c.categoryId}
                                            className={`board-filter-btn ${selectedDepth2Id === c.categoryId ? 'active' : ''}`}
                                            onClick={() => handleDepth2Click(c.categoryId)}
                                        >
                                            {c.categoryName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 게시글 목록 */}
                <div className="board-list">
                    {loading ? (
                        <div className="board-loading">로딩 중...</div>
                    ) : posts.length === 0 ? (
                        <div className="board-empty">게시글이 없습니다.</div>
                    ) : (
                        posts.map(post => (
                            <div
                                key={post.postId}
                                className={`board-item ${post.isNotice === 'Y' ? 'notice' : ''}`}
                                onClick={() => navigate(`/board/${post.postId}`)}
                            >
                                <div className="board-item-main">
                                    <div className="board-item-meta">
                                        <span className="board-item-category">{post.categoryName}</span>
                                        {post.csCategoryName && (
                                            <span className="board-item-cscategory">[{post.csCategoryName}]</span>
                                        )}
                                    </div>
                                    <div className="board-item-title">{post.title}</div>
                                    <div className="board-item-info">
                                        <span className="board-item-author">{post.nickname}</span>
                                        <span>·</span>
                                        <span className="board-item-date">
                                            {post.createdAt?.slice(0, 10)}
                                        </span>
                                        <span>·</span>
                                        <span className="board-item-date">
                                            조회수 {post.viewCount ?? 0}
                                        </span>
                                    </div>
                                    {post.hashtags?.length > 0 && (
                                        <div className="board-item-tags">
                                            {post.hashtags.map(tag => (
                                                <span key={tag} className="board-item-tag">#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="board-item-counts">
                                    <span><Heart size={13} /> {post.likeCount ?? 0}</span>
                                    <span><Bookmark size={13} /> {post.scrapCount ?? 0}</span>
                                    <span><MessageCircle size={13} /> {post.commentCount ?? 0}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 하단: 페이징 + 글작성 */}
                <div className="board-bottom">
                    <div className="board-paging">
                        <button onClick={() => setPage(1)} disabled={page === 1}>{'<<'}</button>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{'<'}</button>
                        {getPageNumbers().map((p, i) =>
                            p === '...'
                                ? <span key={`ellipsis-${i}`} className="board-page-ellipsis">...</span>
                                : <button
                                    key={p}
                                    className={`board-page-btn ${page === p ? 'active' : ''}`}
                                    onClick={() => setPage(p)}
                                >{p}</button>
                        )}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}>{'>'}</button>
                        <button onClick={() => setPage(totalPages)} disabled={page === totalPages || totalPages === 0}>{'>>'}</button>
                    </div>
                    {authStatus === 'authenticated' && (
                        <button
                            className="board-write-btn"
                            onClick={() => navigate('/board/write')}
                        >
                            글 작성
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}