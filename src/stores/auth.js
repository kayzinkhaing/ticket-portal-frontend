// src/stores/auth.js
import { defineStore } from 'pinia'
import { AuthService } from '@/services/authService'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('auth_user')) || null,
    token: localStorage.getItem('auth_token') || null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isClient: (state) => state.user?.role === 'client',
    isAgent: (state) => state.user?.role === 'agent',
    clientProfileId: (state) => state.isClient ? state.user.clientProfiles?.[0]?.id : null,
    userId: (state) => state.user?.id || null,
  },

  actions: {
    // ✅ Clear auth state
    clearUser() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },

    async login(payload) {
      this.isLoading = true
      try {
        const res = await AuthService.login(payload)
        const data = res.data.data

        this.user = {
          ...data.user,
          role: data.role,
          organization: data.organization || null,
          clientProfiles: data.user.clientProfiles || []
        }
        this.token = data.token

        localStorage.setItem('auth_token', this.token)
        localStorage.setItem('auth_user', JSON.stringify(this.user))

        return this.user.role === 'agent'
          ? '/agent/tickets/all'
          : '/client/tickets/all'

      } catch (err) {
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchUser() {
      if (!this.token) return

      this.isLoading = true
      try {
        const res = await AuthService.profile()
        const data = res.data.data

        this.user = {
          ...data.user,
          role: data.role || this.user?.role,
          organization: data.organization || this.user?.organization,
          clientProfiles: data.user.clientProfiles || this.user?.clientProfiles || []
        }

        localStorage.setItem('auth_user', JSON.stringify(this.user))
      } catch (err) {
        this.clearUser()
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Proper logout to prevent flash redirect
    async logout(redirectTo = '/login') {
      // 1️⃣ Clear user state first
      this.clearUser()

      try {
        await AuthService.logout()
      } catch (e) {
        console.warn('Logout API failed')
      }

      // 2️⃣ Navigate after clearing state
      router.push(redirectTo)
    },

    async initialize() {
      if (this.token && !this.user) {
        try {
          await this.fetchUser()
        } catch (e) {
          console.warn('Session restore failed')
        }
      }
    },
  },
})