// src/store/authStore.js
import { create } from 'zustand'

const useAuthStore = create((set) => ({
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
}))

export default useAuthStore