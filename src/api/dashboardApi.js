import api from './axiosInstance'

export const fetchDashboard = async (page = 1, size = 5) => {
    const { data } = await api.get('/interview/v1/dashboard', {
        params: { page, size }
    })
    return data?.data
}