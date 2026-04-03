import api from '../api';
import { ROUTES } from '../constants/routes';

export const DashboardService = {
  getStats: () => api.get(ROUTES.dashboard.url), // ✅ access the string
  getTickets: () => api.get(ROUTES.tickets.list), // also good practice
};