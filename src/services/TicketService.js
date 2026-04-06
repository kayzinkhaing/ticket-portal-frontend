// src/services/TicketService.js

import api from "../api";
import { ROUTES } from "../constants/routes";

export const TicketService = {
  /* -------------------------
   BASIC CRUD
  ------------------------- */
  // getAll: (page = 1) => api.get(`${ROUTES.tickets.list}?page=${page}`),
  getAll: (page = 1) => api.get(ROUTES.tickets.list, { params: { page } }),

  getById: (id) => api.get(ROUTES.tickets.item(id)),

  create: (payload) => api.post(ROUTES.tickets.create, payload),

  update: (id, payload) => api.put(ROUTES.tickets.update(id), payload),

  delete: (id) => api.delete(ROUTES.tickets.delete(id)),

  /* -------------------------
   CUSTOM APIs
  ------------------------- */

  // ✅ Organization tickets
  ticketOrg: async (page = 1, filters = {}) => {
  try {
    const res = await api.get(ROUTES.tickets.ticketOrg, {
      params: {
        page,
        ...filters, // spread safely
      },
    });
    return res;
  } catch (err) {
    console.error("TicketOrg API Error:", err);
    throw err;
  }
},

  
advancedSearch: (filters) => {
  const params = {};
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== "" && !(Array.isArray(filters[key]) && filters[key].length === 0)) {
      params[key] = filters[key];
    }
  });
  return api.get("/v1/tickets/advanced-search", { params });
},
  // ✅ Get tickets by status
  getByStatus: (status, page = 1) =>
    api.get(ROUTES.tickets.status, {
      params: {
        status: status === "All" ? "all" : status.toLowerCase(),
        page,
      },
    }),

  // ✅ Get dashboard counts
  getStatusCounts: () => api.get(ROUTES.tickets.statusCounts),
  getAgents: () => api.get(ROUTES.users.agent),
};
