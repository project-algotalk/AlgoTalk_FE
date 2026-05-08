// src/api/axiosInstance.js
import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// 401은 게이트웨이에서 자동 재발급/재시도 처리
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const original = err.config

    // 로그인/계정찾기 URL은 인터셉터 제외
    const excludeUrls = ['/user/v1/login', '/user/v1/find/']
    if (excludeUrls.some(url => original?.url?.includes(url))) {
      return Promise.reject(err)
    }

    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }

    return Promise.reject(err)
  }
)

export default api