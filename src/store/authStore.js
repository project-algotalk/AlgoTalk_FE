import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      authStatus: 'checking',

      login: ({ user }) => set({
        user, // 메모리에 저장
        authStatus: 'authenticated',
      }),

      logout: () => {
        // 다른 탭에 로그아웃 알림
        localStorage.setItem('logout-signal', Date.now().toString())
        set({
          user: null,
          authStatus: 'unauthenticated',
        })
      },

      setUnauthenticated: () => set({
        user: null,
        authStatus: 'unauthenticated',
      }),

      setChecking: () => set({ authStatus: 'checking' }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      // 쿠키 기반 인증 구조라 user/authStatus만 저장
      partialize: (state) => ({
        user: state.user,
        authStatus: state.authStatus,
      }),
    }
  )
)

export default useAuthStore