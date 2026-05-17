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

export const updateTargetJobs = async (payload) => {
    await api.post('/mypage/v1/target-jobs', payload)
}

export const updateEmployments = async (payload) => {
    await api.post('/mypage/v1/employments', payload)
}

export const withdraw = async (payload) => {
    await api.delete('/mypage/v1/withdraw', { data: payload })
}