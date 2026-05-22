import api from './axiosInstance'

// LLM 질문 생성 세션 생성
export const createLlmSession = async (payload) => {
    const { data } = await api.post('/interview/v1/sessions/llm', payload)
    return data?.data
}

// 직접입력 세션 생성
export const createManualSession = async (payload) => {
    const { data } = await api.post('/interview/v1/sessions/manual', payload)
    return data?.data
}

// CS 카테고리 목록 조회
export const fetchCsCategories = async () => {
    const { data } = await api.get('/cs-categories/v1')
    return data?.data
}