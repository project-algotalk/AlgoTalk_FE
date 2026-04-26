// src/api/axiosInstance.js
import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// JWT 페이로드 디코딩 (한글 포함)
export const decodeJwt = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const jsonStr = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(jsonStr)
  } catch {
    return {}
  }
}

// AT 자동 주입
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 401 → 토큰 재발급 후 재시도
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config

    // 로그인/재발급 URL은 인터셉터 제외
    const excludeUrls = ['/user/v1/login', '/user/v1/token/reissue']
    if (excludeUrls.some(url => original.url?.includes(url))) {
      return Promise.reject(err)
    }

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/v1/token/reissue`,
          {},
          { withCredentials: true }
        )
        const tokenData = data.data
        const payload = decodeJwt(tokenData.accessToken)

        useAuthStore.getState().login({
          accessToken: tokenData.accessToken,
          user: {
            userId:   payload.sub,
            loginId:  payload.loginId,
            nickname: payload.nickname,
            roles:    payload.roles,
          },
        })

        original.headers.Authorization = `Bearer ${tokenData.accessToken}`
        return api(original)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(err)
  }
)

export default api

