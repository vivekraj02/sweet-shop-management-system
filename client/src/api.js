import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

const instance = axios.create({ baseURL: API_BASE + '/api' })

export default {
  setToken(token) {
    if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete instance.defaults.headers.common['Authorization']
  },
  async register(data) {
    return instance.post('/auth/register', data)
  },
  async login(data) {
    return instance.post('/auth/login', data)
  },
  async getSweets() {
    return instance.get('/sweets')
  },
  async searchSweets(params) {
    return instance.get('/sweets/search', { params })
  },
  async createSweet(data) {
    return instance.post('/sweets', data)
  },
  async updateSweet(id, data) {
    return instance.put(`/sweets/${id}`, data)
  },
  async deleteSweet(id) {
    return instance.delete(`/sweets/${id}`)
  },
  async purchaseSweet(id, data) {
    return instance.post(`/sweets/${id}/purchase`, data)
  },
  async restockSweet(id, data) {
    return instance.post(`/sweets/${id}/restock`, data)
  }
}
