import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import {
    fetchPostDetail,
    deletePost,
    fetchCommentList,
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    toggleScrap,
} from '../../api/boardApi'
import useAuthStore from '../../store/authStore'
import { Heart, Bookmark, MessageCircle, Eye } from 'lucide-react'
import './BoardDetailPage.css'

export default function BoardDetailPage() {
    const { postId } = useParams()
    const navigate = useNavigate()
    const { user, authStatus } = useAuthStore()

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)

    // 댓글 입력
    const [commentInput, setCommentInput] = useState('')
    // 대댓글 입력 (key: parentCommentId)
    const [replyInputs, setReplyInputs] = useState({})
    // 댓글 수정 (key: commentId)
    const [editInputs, setEditInputs] = useState({})
    // 대댓글 입력창 열림 여부 (key: commentId)
    const [openReplyIds, setOpenReplyIds] = useState({})

    const isLoggedIn = authStatus === 'authenticated'
    const isAuthor = post && user && post.userId === user.userId

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true)
            try {
                const [postData, commentData] = await Promise.all([
                    fetchPostDetail(postId),
                    fetchCommentList(postId),
                ])
                setPost(postData)
                setComments(commentData || [])
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        loadAll()
    }, [postId])

    // ==================== 좋아요 / 스크랩 ====================

    const handleLike = async () => {
        if (!isLoggedIn) return alert('로그인이 필요합니다.')
        try {
            const result = await toggleLike(postId)
            setPost(prev => ({
                ...prev,
                liked: result.liked,
                likeCount: result.likeCount,
            }))
        } catch (e) {
            console.error(e)
        }
    }

    const handleScrap = async () => {
        if (!isLoggedIn) return alert('로그인이 필요합니다.')
        try {
            const result = await toggleScrap(postId)
            setPost(prev => ({
                ...prev,
                scrapped: result.scrapped,
                scrapCount: result.scrapCount,
            }))
        } catch (e) {
            console.error(e)
        }
    }

    // ==================== 게시글 삭제 ====================

    const handleDeletePost = async () => {
        if (!window.confirm('게시글을 삭제하시겠습니까?')) return
        try {
            await deletePost(postId)
            navigate('/board')
        } catch (e) {
            console.error(e)
        }
    }

    // ==================== 댓글 등록 ====================

    const handleSubmitComment = async () => {
        if (!commentInput.trim()) return
        try {
            await createComment(postId, { content: commentInput })
            setCommentInput('')
            const updated = await fetchCommentList(postId)
            setComments(updated || [])
        } catch (e) {
            console.error(e)
        }
    }

    // ==================== 대댓글 등록 ====================

    const handleSubmitReply = async (parentId) => {
        const content = replyInputs[parentId]?.trim()
        if (!content) return
        try {
            await createComment(postId, { content, parentId })
            setReplyInputs(prev => ({ ...prev, [parentId]: '' }))
            setOpenReplyIds(prev => ({ ...prev, [parentId]: false }))
            const updated = await fetchCommentList(postId)
            setComments(updated || [])
        } catch (e) {
            console.error(e)
        }
    }

    // ==================== 댓글 수정 ====================

    const handleStartEdit = (comment) => {
        setEditInputs(prev => ({ ...prev, [comment.commentId]: comment.content }))
    }

    const handleSubmitEdit = async (commentId) => {
        const content = editInputs[commentId]?.trim()
        if (!content) return
        try {
            await updateComment(postId, commentId, { content })
            setEditInputs(prev => {
                const next = { ...prev }
                delete next[commentId]
                return next
            })
            const updated = await fetchCommentList(postId)
            setComments(updated || [])
        } catch (e) {
            console.error(e)
        }
    }

    // ==================== 댓글 삭제 ====================

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return
        try {
            await deleteComment(postId, commentId)
            const updated = await fetchCommentList(postId)
            setComments(updated || [])
        } catch (e) {
            console.error(e)
        }
    }

    // ==================== 댓글 트리 구성 ====================

    const buildCommentTree = (comments) => {
        const roots = comments.filter(c => c.depth === 0)
        return roots.map(root => ({
            ...root,
            children: comments.filter(c => c.groupId === root.commentId && c.depth === 1).map(child => ({
                ...child,
                children: comments.filter(c => c.parentId === child.commentId && c.depth === 2)
            }))
        }))
    }

    const commentTree = buildCommentTree(comments)

    if (loading) return (
        <div className="board-detail-wrap">
            <Navbar />
            <div className="board-detail-loading">로딩 중...</div>
        </div>
    )

    if (!post) return (
        <div className="board-detail-wrap">
            <Navbar />
            <div className="board-detail-loading">게시글을 찾을 수 없습니다.</div>
        </div>
    )

    return (
        <div className="board-detail-wrap">
            <Navbar />
            <div className="board-detail-container">

                {/* 뒤로가기 */}
                <button className="board-detail-back" onClick={() => navigate('/board')}>
                    &lt;
                </button>

                {/* 게시글 */}
                <div className="board-detail-post">
                    {/* 브레드크럼 */}
                    <div className="board-detail-breadcrumb">
                        {post.categoryName} &gt;
                        {post.csCategoryName && <span> [{post.csCategoryName}]</span>}
                    </div>

                    {/* 제목 */}
                    <h2 className="board-detail-title">{post.title}</h2>

                    {/* 작성자 정보 */}
                    <div className="board-detail-meta">
                        <div className="board-detail-author-wrap">
                            <div className="board-detail-avatar" />
                            <div>
                                <div className="board-detail-author">{post.nickname}</div>
                                <div className="board-detail-date">
                                    {post.createdAt?.slice(0, 10)} 조회 {post.viewCount}
                                </div>
                            </div>
                        </div>
                        <div className="board-detail-counts">
                            <span><Bookmark size={13} /> {post.scrapCount ?? 0}</span>
                            <span>
                                <MessageCircle size={13} />
                                {post.commentCount ?? 0}
                            </span>                  </div>
                    </div>

                    <hr className="board-detail-divider" />

                    {/* 본문 */}
                    <div className="board-detail-content">{post.content}</div>

                    {/* 해시태그 */}
                    {post.hashtags?.length > 0 && (
                        <div className="board-detail-tags">
                            {post.hashtags.map(tag => (
                                <span key={tag} className="board-detail-tag">#{tag}</span>
                            ))}
                        </div>
                    )}

                    <hr className="board-detail-divider" />

                    {/* 좋아요 / 스크랩 */}
                    <div className="board-detail-actions">
                        <button
                            className={`board-action-btn ${post.liked ? 'active' : ''}`}
                            onClick={handleLike}
                        >
                            <Heart size={15} fill={post.liked ? 'currentColor' : 'none'} />
                            좋아요 {post.likeCount ?? 0}
                        </button>
                        {post.isScrapable === 'Y' && (
                            <button
                                className={`board-action-btn ${post.scrapped ? 'active' : ''}`}
                                onClick={handleScrap}
                            >
                                <Bookmark size={15} fill={post.scrapped ? 'currentColor' : 'none'} />
                                스크랩하기
                            </button>
                        )}
                    </div>
                </div>

                {/* 댓글 목록 */}
                <div className="board-detail-comments">
                    <div className="board-comment-header">
                        <span className="board-comment-sort">등록순</span>
                        <span className="board-comment-sort">최신순</span>
                    </div>

                    {commentTree.map(comment => (
                        <div key={comment.commentId} className="board-comment-group">
                            {/* 댓글 */}
                            <CommentItem
                                comment={comment}
                                user={user}
                                isLoggedIn={isLoggedIn}
                                editInputs={editInputs}
                                openReplyIds={openReplyIds}
                                replyInputs={replyInputs}
                                onStartEdit={handleStartEdit}
                                onSubmitEdit={handleSubmitEdit}
                                onDelete={handleDeleteComment}
                                onToggleReply={(id) => setOpenReplyIds(prev => ({ ...prev, [id]: !prev[id] }))}
                                onReplyChange={(id, val) => setReplyInputs(prev => ({ ...prev, [id]: val }))}
                                onSubmitReply={handleSubmitReply}
                                onEditChange={(id, val) => setEditInputs(prev => ({ ...prev, [id]: val }))}
                                depth={0}
                            />
                            {/* 대댓글 */}
                            {comment.children?.map(child => (
                                <div key={child.commentId} className="board-comment-indent">
                                    <CommentItem
                                        comment={child}
                                        user={user}
                                        isLoggedIn={isLoggedIn}
                                        editInputs={editInputs}
                                        openReplyIds={openReplyIds}
                                        replyInputs={replyInputs}
                                        onStartEdit={handleStartEdit}
                                        onSubmitEdit={handleSubmitEdit}
                                        onDelete={handleDeleteComment}
                                        onToggleReply={(id) => setOpenReplyIds(prev => ({ ...prev, [id]: !prev[id] }))}
                                        onReplyChange={(id, val) => setReplyInputs(prev => ({ ...prev, [id]: val }))}
                                        onSubmitReply={handleSubmitReply}
                                        onEditChange={(id, val) => setEditInputs(prev => ({ ...prev, [id]: val }))}
                                        depth={1}
                                    />
                                    {/* 대대댓글 */}
                                    {child.children?.map(grandChild => (
                                        <div key={grandChild.commentId} className="board-comment-indent">
                                            <CommentItem
                                                comment={grandChild}
                                                user={user}
                                                isLoggedIn={isLoggedIn}
                                                editInputs={editInputs}
                                                openReplyIds={openReplyIds}
                                                replyInputs={replyInputs}
                                                onStartEdit={handleStartEdit}
                                                onSubmitEdit={handleSubmitEdit}
                                                onDelete={handleDeleteComment}
                                                onToggleReply={(id) => setOpenReplyIds(prev => ({ ...prev, [id]: !prev[id] }))}
                                                onReplyChange={(id, val) => setReplyInputs(prev => ({ ...prev, [id]: val }))}
                                                onSubmitReply={handleSubmitReply}
                                                onEditChange={(id, val) => setEditInputs(prev => ({ ...prev, [id]: val }))}
                                                depth={2}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* 댓글 입력 */}
                    {isLoggedIn && (
                        <div className="board-comment-input-wrap">
                            <div className="board-comment-input-author">{user?.nickname}</div>
                            <textarea
                                className="board-comment-textarea"
                                placeholder="댓글을 남겨보세요"
                                value={commentInput}
                                onChange={e => setCommentInput(e.target.value)}
                            />
                            <div className="board-comment-input-footer">
                                <button
                                    className="board-comment-submit-btn"
                                    onClick={handleSubmitComment}
                                >
                                    등록
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 하단 버튼 */}
                <div className="board-detail-footer">
                    <div className="board-detail-footer-left">
                        {isLoggedIn && (
                            <button
                                className="board-footer-btn primary"
                                onClick={() => navigate('/board/write')}
                            >
                                글 작성
                            </button>
                        )}
                        {isAuthor && (
                            <>
                                <button
                                    className="board-footer-btn"
                                    onClick={() => navigate(`/board/write?edit=${postId}`)}
                                >
                                    수정
                                </button>
                                <button
                                    className="board-footer-btn danger"
                                    onClick={handleDeletePost}
                                >
                                    삭제
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        className="board-footer-btn"
                        onClick={() => navigate('/board')}
                    >
                        목록
                    </button>
                </div>

            </div>
        </div>
    )
}

// ==================== 댓글 아이템 컴포넌트 ====================

function CommentItem({
    comment, user, isLoggedIn,
    editInputs, openReplyIds, replyInputs,
    onStartEdit, onSubmitEdit, onDelete,
    onToggleReply, onReplyChange, onSubmitReply,
    onEditChange, depth
}) {
    const isCommentAuthor = user && comment.userId === user.userId
    const isEditing = editInputs[comment.commentId] !== undefined
    const isDeleted = comment.deletedYn === 'Y'

    return (
        <div className={`board-comment-item ${depth > 0 ? 'reply' : ''}`}>
            <div className="board-comment-avatar" />
            <div className="board-comment-body">
                <div className="board-comment-top">
                    <span className="board-comment-author">{comment.nickname}</span>
                    {isCommentAuthor && (
                        <span className="board-comment-badge">작성자</span>
                    )}
                </div>

                {isEditing ? (
                    <div className="board-comment-edit-wrap">
                        <textarea
                            className="board-comment-textarea"
                            value={editInputs[comment.commentId]}
                            onChange={e => onEditChange(comment.commentId, e.target.value)}
                        />
                        <button
                            className="board-comment-submit-btn"
                            onClick={() => onSubmitEdit(comment.commentId)}
                        >
                            등록
                        </button>
                    </div>
                ) : (
                    <div className="board-comment-content">
                        {isDeleted ? '삭제된 댓글입니다.' : comment.content}
                    </div>
                )}

                <div className="board-comment-bottom">
                    <span className="board-comment-date">
                        {comment.createdAt?.slice(0, 10)}
                        {isLoggedIn && !isDeleted && depth < 2 && (
                            <button
                                className="board-comment-reply-btn"
                                onClick={() => onToggleReply(comment.commentId)}
                            >
                                답글쓰기
                            </button>
                        )}
                    </span>
                    {isCommentAuthor && !isDeleted && (
                        <div className="board-comment-actions">
                            <button onClick={() => onStartEdit(comment)}>수정</button>
                            <button onClick={() => onDelete(comment.commentId)}>삭제</button>
                        </div>
                    )}
                </div>

                {/* 대댓글 입력창 */}
                {openReplyIds[comment.commentId] && isLoggedIn && (
                    <div className="board-comment-input-wrap reply-input">
                        <div className="board-comment-input-author">{user?.nickname}</div>
                        <textarea
                            className="board-comment-textarea"
                            placeholder="댓글을 남겨보세요"
                            value={replyInputs[comment.commentId] || ''}
                            onChange={e => onReplyChange(comment.commentId, e.target.value)}
                        />
                        <div className="board-comment-input-footer">
                            <button
                                className="board-comment-submit-btn"
                                onClick={() => onSubmitReply(comment.commentId)}
                            >
                                등록
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}