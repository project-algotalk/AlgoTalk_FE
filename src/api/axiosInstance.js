import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// 요청마다 AT 자동 주입
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

    // 로그인/재발급 요청은 인터셉터 제외 (무한루프 + 새로고침 방지)
    const excludeUrls = ['/user/v1/login', '/user/v1/token/reissue']
    if (excludeUrls.some((url) => original.url?.includes(url))) {
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
        const newToken = data.accessToken
        useAuthStore.getState().setAuth(
          useAuthStore.getState().user,
          newToken
        )
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
    }

    return Promise.reject(err)
  }
)

export default api