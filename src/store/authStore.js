// src/store/authStore.js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      authStatus: 'checking',
      // checking | authenticated | unauthenticated

      login: ({ accessToken, user }) => set({
        accessToken,
        user,
        authStatus: 'authenticated',
      }),

      logout: () => set({
        accessToken: null,
        user: null,
        authStatus: 'unauthenticated',
      }),

      setChecking: () => set({ authStatus: 'checking' }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        authStatus: state.authStatus,
      }),
    }
  )
)

export default useAuthStore
