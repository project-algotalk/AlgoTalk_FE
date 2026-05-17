// src/api/csCategoryApi.js
import api from './axiosInstance'

export const fetchCategories = async () => {
    const res = await api.get('/cs-categories/v1')
    return res.data.data
}