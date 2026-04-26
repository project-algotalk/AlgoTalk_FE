import { Navigate, Outlet } from 'react-router-dom'

export default function SignupStepGuard({ requiredKey }) {
  const data = sessionStorage.getItem(requiredKey)
  // oauth-temp-token 있으면 소셜 회원가입 → step1 없어도 통과
  const isSocialSignup = sessionStorage.getItem('oauth-temp-token')

  if (requiredKey === 'signup-step1' && isSocialSignup) {
    return <Outlet />
  }

  return data ? <Outlet /> : <Navigate to="/signup" replace />
}