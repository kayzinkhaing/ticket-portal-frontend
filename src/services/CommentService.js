// src/services/CommentService.js
import api from '../api';
import { ROUTES } from '../constants/routes';

export const CommentService = {
  // CommentService.js
getAll: (params = {}) => api.get(ROUTES.comments.list, { params }),
  create: (payload) => api.post(ROUTES.comments.create, payload),
  update: (id, payload) => api.put(ROUTES.comments.update(id), payload),
  delete: (id) => api.delete(ROUTES.comments.delete(id)),
};