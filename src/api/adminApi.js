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