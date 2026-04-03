import api from '../api'
import { ROUTES } from '../constants/routes'

export const OrganizationService = {
  // Get all organizations
  getAll: async () => {
    const res = await api.get(ROUTES.organizations.list);
    // ✅ Return the array directly
    return res.data.data.organizations || [];
  },

  // Optional: get single organization
  getById: async (id) => {
    const response = await api.get(ROUTES.organizations.item(id))
    return response.data
  },
}