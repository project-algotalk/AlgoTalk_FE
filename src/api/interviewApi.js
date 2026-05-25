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
    return data?.data ?? data  // 백엔드 응답이 { data: ... } 또는 중첩 없는 객체여도 동일 형태로 사용하도록 정규화
}

// 답변 분석 결과 저장
export const saveAnswer = async (sessionId, sessionQuestionId, payload) => {
    const { data } = await api.post(
        `/interview/v1/sessions/${sessionId}/questions/${sessionQuestionId}/answer`,
        payload
    )
    return data?.data
}