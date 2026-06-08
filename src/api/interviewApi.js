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
    const extensionByMimeType = {
        'audio/webm': 'webm',
        'audio/ogg': 'ogg',
        'audio/mp4': 'mp4',
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav',
    }
    const baseMimeType = (audioBlob?.type || 'audio/webm').split(';')[0]
    const extension = extensionByMimeType[baseMimeType] || 'webm'
    formData.append('file', audioBlob, `answer.${extension}`)
    const { data } = await api.post('/ai/v1/stt/transcribe', formData)
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

// 세션 완료 처리
export const completeSession = async (sessionId) => {
    const { data } = await api.patch(`/interview/v1/sessions/${sessionId}/complete`)
    return data?.data
}

// 세션 결과 조회
export const fetchSessionResult = async (sessionId) => {
    const { data } = await api.get(`/interview/v1/sessions/${sessionId}/result`)
    return data?.data
}