// src/services/PriorityService.js
import api from '../api'
import { ROUTES } from '../constants/routes'
let cache = null;
export const PriorityService = {
  
  // Get all priorities
  getAll: async (page = 1) => {
    const res = await api.get(ROUTES.ticketPriorities.list, {
      params: { page },
    });

    // ✅ extract correct data
    return res.data.data.ticketpriorities.data;
  },

  // Get single priority by ID
  getById: (id) => api.get(ROUTES.ticketPriorities.item(id)),

  // Create a new priority
  create: (payload) => api.post(ROUTES.ticketPriorities.create, payload),

  // Update an existing priority
  update: (id, payload) => api.put(ROUTES.ticketPriorities.update(id), payload),

  // Delete a priority
  delete: (id) => api.delete(ROUTES.ticketPriorities.delete(id)),
}