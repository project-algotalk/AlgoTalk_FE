import api from './axiosInstance'

// ==================== 게시글 ====================

// 게시글 목록 조회
export const fetchPostList = async (params) => {
    const { data } = await api.get('/community/v1/posts', {
        params,
        paramsSerializer: (p) => {
            const searchParams = new URLSearchParams()
            Object.entries(p).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(key, v))
                } else if (value !== undefined && value !== null) {
                    searchParams.append(key, value)
                }
            })
            return searchParams.toString()
        }
    })
    return data?.data
}

// 게시글 상세 조회
export const fetchPostDetail = async (postId) => {
    const { data } = await api.get(`/community/v1/posts/${postId}`)
    return data?.data
}

// 게시글 작성
export const createPost = async (payload) => {
    const { data } = await api.post('/community/v1/posts', payload)
    return data?.data
}

// 게시글 수정
export const updatePost = async (postId, payload) => {
    const { data } = await api.put(`/community/v1/posts/${postId}`, payload)
    return data?.data
}

// 게시글 삭제
export const deletePost = async (postId) => {
    const { data } = await api.delete(`/community/v1/posts/${postId}`)
    return data?.data
}

// ==================== 댓글 ====================

// 댓글 목록 조회
export const fetchCommentList = async (postId, sortType = 'ASC') => {
    const { data } = await api.get(`/community/v1/posts/${postId}/comments`, {
        params: { sortType }
    })
    return data?.data
}

// 댓글 작성
export const createComment = async (postId, payload) => {
    const { data } = await api.post(`/community/v1/posts/${postId}/comments`, payload)
    return data?.data
}

// 댓글 수정
export const updateComment = async (postId, commentId, payload) => {
    const { data } = await api.put(`/community/v1/posts/${postId}/comments/${commentId}`, payload)
    return data?.data
}

// 댓글 삭제
export const deleteComment = async (postId, commentId) => {
    const { data } = await api.delete(`/community/v1/posts/${postId}/comments/${commentId}`)
    return data?.data
}

// ==================== 좋아요 / 스크랩 ====================

// 좋아요 토글
export const toggleLike = async (postId) => {
    const { data } = await api.post(`/community/v1/posts/${postId}/likes`)
    return data?.data
}

// 스크랩 토글
export const toggleScrap = async (postId) => {
    const { data } = await api.post(`/community/v1/posts/${postId}/scraps`)
    return data?.data
}