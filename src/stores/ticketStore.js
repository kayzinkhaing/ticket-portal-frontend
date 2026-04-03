// src/stores/ticketStore.js
import { defineStore } from 'pinia'
import { TicketService } from '@/services/TicketService'
import { StatusService } from '@/services/StatusService'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    tickets: [],
    ticketStatuses: [],  // dynamic statuses
    counts: {},          // status counts
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStatuses() {
      try {
        const res = await StatusService.getAll()
        this.ticketStatuses = res.data?.ticketstatuses?.map(s => s.name) || []
      } catch (err) {
        console.error('Failed to fetch statuses', err)
      }
    },

    async fetchTickets() {
      this.loading = true
      this.error = null
      try {
        const res = await TicketService.getAll()
        this.tickets = res.data?.tickets || []
      } catch (err) {
        console.error('Failed to fetch tickets', err)
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async fetchStatusCounts() {
      try {
        const res = await TicketService.getStatusCounts()
        this.counts = res.data?.data?.counts || {}
      } catch (err) {
        console.error('Failed to fetch counts', err)
      }
    },

    async fetchOrganizationTickets() {
      this.loading = true
      try {
        const res = await TicketService.ticketOrg()
        console.log('Org tickets response:', res.data)
        this.tickets = res.data?.tickets || []
      } catch (err) {
        console.error('Failed to fetch org tickets', err)
      } finally {
        this.loading = false
      }
    },

    async createTicket(payload) {
      try {
        const res = await TicketService.create(payload)
        this.tickets.push(res.data?.data)
        return res.data?.data
      } catch (err) {
        throw err
      }
    },

    async deleteTicket(id) {
      try {
        await TicketService.delete(id)
        this.tickets = this.tickets.filter(t => t.id !== id)
      } catch (err) {
        console.error('Failed to delete ticket', err)
        throw err
      }
    },
  },
})