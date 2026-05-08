import api from './axiosInstance'

export const fetchMe = async () => {
  const { data } = await api.get('/user/v1/me')
  return data?.data
}

export const loginWithCredentials = async ({ loginId, password }) => {
  await api.post('/user/v1/login', { loginId, password })
  return fetchMe()
}