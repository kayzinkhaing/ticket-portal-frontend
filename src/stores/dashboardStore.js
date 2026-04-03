// src/stores/dashboardStore.js
import { defineStore } from 'pinia'
import { DashboardService } from '@/services/DashboardService'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: [],
    tickets: [],
    loading: false,
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true
      try {
        const [statsRes, ticketsRes] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getTickets(),
        ])
        this.stats = statsRes.data
        this.tickets = ticketsRes.data
      } finally {
        this.loading = false
      }
    },
  },
})