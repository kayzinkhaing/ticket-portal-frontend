// src/services/authService.js
import api from '../api'
import { ROUTES } from '../constants/routes'

export const AuthService = {
  register: (payload) => api.post(ROUTES.auth.register, payload),

  login: async (payload) => {
    const response = await api.post(ROUTES.auth.login, payload)
    if (response.data?.token) localStorage.setItem('auth_token', response.data.token)
    return response
  },

  profile: () => api.get(ROUTES.auth.profile),

  logout: () => {
    localStorage.removeItem('auth_token')
    return api.post(ROUTES.auth.logout)
  },

  // ✅ Rename `token` to `otp`
  verifyEmail: (email, otp) => {
    return api.post(ROUTES.auth.verifyEmail, { email, otp })
  },
}