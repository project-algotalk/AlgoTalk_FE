import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      authStatus: 'checking',

      login: ({ accessToken, user }) => set({
        accessToken,
        user,
        authStatus: 'authenticated',
      }),

      logout: () => {
        // 다른 탭에 로그아웃 알림
        localStorage.setItem('logout-signal', Date.now().toString())
        set({
          accessToken: null,
          user: null,
          authStatus: 'unauthenticated',
        })
      },

      setChecking: () => set({ authStatus: 'checking' }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      // 보안을 위해 accessToken은 저장소(sessionStorage)에서 제외
      partialize: (state) => ({
        user: state.user,
        authStatus: state.authStatus,
      }),
    }
  )
)

export default useAuthStore