// src/services/StatusService.js
import api from '../api';
import { ROUTES } from '../constants/routes';

export const StatusService = {
  getAll: async (page = 1) => {
    const res = await api.get(ROUTES.ticketStatuses.list, {
      params: { page },
    });

    return res.data.data.ticketstatuses.data;
  },
  getById: (id) => api.get(ROUTES.ticketStatuses.item(id)),
  create: (payload) => api.post(ROUTES.ticketStatuses.create, payload),
  update: (id, payload) => api.put(ROUTES.ticketStatuses.update(id), payload),
  delete: (id) => api.delete(ROUTES.ticketStatuses.delete(id)),
};