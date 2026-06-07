// src/api/myPageApi.js
import api from './axiosInstance'

export const fetchMyPageInfo = async () => {
    const { data } = await api.get('/mypage/v1')
    return data?.data
}

export const updateLoginId = async (payload) => {
    await api.post('/mypage/v1/update-loginId', payload)
}

export const updatePassword = async (payload) => {
    await api.post('/mypage/v1/update-password', payload)
}

export const setPassword = async (payload) => {
    await api.post('/mypage/v1/set-password', payload)
}

export const updateNickname = async (payload) => {
    await api.post('/mypage/v1/update-nickname', payload)
}

export const updateName = async (payload) => {
    await api.post('/mypage/v1/update-name', payload)
}

export const updateAddr = async (payload) => {
    await api.post('/mypage/v1/update-addr', payload)
}

export const sendEmailCode = async (payload) => {
    await api.post('/mypage/v1/email-code', payload)
}

export const verifyEmailCode = async (payload) => {
    await api.post('/mypage/v1/verify-code', payload)
}

export const updateEmail = async (payload) => {
    await api.post('/mypage/v1/update-email', payload)
}

export const issueLinkToken = async (provider) => {
    const res = await api.post(`/mypage/v1/social/link/${provider}`)
    return res.data.data.linkToken
}

export const unlinkSocial = async (provider) => {
    await api.delete(`/mypage/v1/social/${provider}`)
}

export const logoutAllDevices = async () => {
    await api.post('/user/v1/logout/all')
}

export const updateTargetJobs = async (payload) => {
    await api.post('/mypage/v1/target-jobs', payload)
}

export const updateEmployments = async (payload) => {
    await api.post('/mypage/v1/employments', payload)
}

export const withdraw = async (payload) => {
    await api.delete('/mypage/v1/withdraw', { data: payload })
}

export const fetchTargetJobs = async () => {
    const { data } = await api.get('/mypage/v1/target-jobs')
    return data?.data
}

// 내가 작성한 게시글
export const fetchMyPosts = async (page = 1, size = 10) => {
    const { data } = await api.get('/mypage/v1/posts', { params: { page, size } })
    return data?.data
}
export const deleteMyPosts = async (postIds) => {
    await api.delete('/mypage/v1/posts', { data: postIds })
}

// 내가 작성한 댓글
export const fetchMyComments = async (page = 1, size = 10) => {
    const { data } = await api.get('/mypage/v1/comments', { params: { page, size } })
    return data?.data
}
export const deleteMyComments = async (commentIds) => {
    await api.delete('/mypage/v1/comments', { data: commentIds })
}

// 내가 스크랩한 게시글
export const fetchMyScraps = async (page = 1, size = 10) => {
    const { data } = await api.get('/mypage/v1/scraps', { params: { page, size } })
    return data?.data
}
export const deleteMyScraps = async (postIds) => {
    await api.delete('/mypage/v1/scraps', { data: postIds })
}

// 내가 좋아요한 게시글
export const fetchMyLikes = async (page = 1, size = 10) => {
    const { data } = await api.get('/mypage/v1/likes', { params: { page, size } })
    return data?.data
}
export const deleteMyLikes = async (postIds) => {
    await api.delete('/mypage/v1/likes', { data: postIds })
}