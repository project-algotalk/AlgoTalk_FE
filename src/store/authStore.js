import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      // 상태
      user: null,        // { userId, nickname, email, roles }
      isLoggedIn: false,
      accessToken: null,

      // 액션
      setAuth: (user, accessToken) => set({
        user,
        accessToken,
        isLoggedIn: true,
      }),

      clearAuth: () => set({
        user: null,
        accessToken: null,
        isLoggedIn: false,
      }),

      updateUser: (partial) => set((state) => ({
        user: { ...state.user, ...partial }
      })),
    }),
    {
      name: 'algotalk-auth',   // localStorage 키 이름
      partialize: (state) => ({ // 저장할 항목만 선택
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        // accessToken은 저장 안 함 (보안)
      }),
    }
  )
)

export default useAuthStore