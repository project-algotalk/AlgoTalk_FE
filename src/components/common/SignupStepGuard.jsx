import { Navigate, Outlet } from 'react-router-dom'

// requiredKey: sessionStorage에 있어야 하는 키
export default function SignupStepGuard({ requiredKey }) {
  const data = sessionStorage.getItem(requiredKey)
  return data ? <Outlet /> : <Navigate to="/signup" replace />
}