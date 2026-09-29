import api from './axiosInstance'

export const signUpAdmin = async (payload) => {
  const { data } = await api.post('/admin/v1/signup', payload)
  return data?.data
}

export const fetchAdminStatus = async () => {
  const { data } = await api.get('/admin/v1/signup/status')
  return data?.data
}

export const fetchAdminDashboardSummary = async () => {
  const { data } = await api.get('/admin/v1/dashboard/summary')
  return data?.data
}

export const fetchAdminApplications = async ({
  page = 1,
  size = 10,
  status,
} = {}) => {
  const { data } = await api.get('/admin/v1/applications', {
    params: {
      page,
      size,
      status: status || undefined,
    },
  })

  return data?.data || []
}

export const approveAdminApplication = async (userId) => {
  await api.patch(
    `/admin/v1/applications/${userId}/approve`
  )
}

export const rejectAdminApplication = async (
  userId,
  reason
) => {
  await api.patch(
    `/admin/v1/applications/${userId}/reject`,
    { reason }
  )
}

export const fetchAdminUsers = async ({
  page = 1,
  size = 10,
  keyword = '',
} = {}) => {
  const { data } = await api.get('/admin/v1/users', {
    params: {
      page,
      size,
      keyword: keyword || undefined,
    },
  })

  return data?.data || {
    content: [],
    page,
    size,
    totalCount: 0,
    totalPages: 0,
  }
}

export const unlockUserAccount = async (loginId) => {
  await api.patch('/admin/v1/users/unlock', { loginId })
}
