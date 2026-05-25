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

// STT 변환 요청
export const transcribeAudio = async (audioBlob) => {
    const formData = new FormData()
    formData.append('file', audioBlob, 'answer.webm')
    const { data } = await api.post('/ai/v1/stt/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data  // data?.data → data 로 수정
}

// 답변 분석 결과 저장
export const saveAnswer = async (sessionId, sessionQuestionId, payload) => {
    const { data } = await api.post(
        `/interview/v1/sessions/${sessionId}/questions/${sessionQuestionId}/answer`,
        payload
    )
    return data?.data
}