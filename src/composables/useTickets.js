// src/composables/useTickets.js
import { ref, computed, onMounted, watch } from "vue";
import { TicketService } from "../services/TicketService";

export function useTickets(options = { scope: "all" }) {
  // Refs
  const tickets = ref([]);
  const stats = ref({});
  const loading = ref(false);
  const error = ref(null);

  const currentPage = ref(1);
  const lastPage = ref(1);
  const activeFilter = ref("All");      // Status filter
  const searchQuery = ref("");          // Keyword
  const priorityFilter = ref("");       // Priority
  const organizationFilter = ref("");   // Organization (for org scope)

  // Transform API → UI
  const transformTicket = (t) => ({
    id: t.id,
    title: t.title,
    desc: t.description || "-",
    client: t.client_profile?.user
      ? `${t.client_profile.user.first_name} ${t.client_profile.user.last_name}`
      : "Unknown",
    agent: t.assigned_to
      ? t.assigned_to.first_name
        ? `${t.assigned_to.first_name} ${t.assigned_to.last_name || ""}`
        : "Unassigned"
      : "Unassigned",
    status: t.status?.name || "Open",
    priority: t.priority?.name || "Low",
    created: new Date(t.created_at).toLocaleDateString(),
    sla: t.sla_deadline
      ? new Date(t.sla_deadline) < new Date()
        ? "BREACHED"
        : "ON TRACK"
      : "ON TRACK",
  });

  // -----------------------------
  // Fetch tickets
  // -----------------------------
  const fetchTickets = async (page = 1, filtersParam = {}) => {
  loading.value = true;
  error.value = null;

  try {
    const filters = {
      keyword: searchQuery.value || null,
      status_id: Array.isArray(activeFilter.value) ? activeFilter.value : activeFilter.value !== "All" ? [activeFilter.value] : [],
      priority_id: Array.isArray(priorityFilter.value) ? priorityFilter.value : priorityFilter.value ? [priorityFilter.value] : [],
      organization_id: organizationFilter.value || null,
      page,
      ...filtersParam, // allow overrides
    };

    let res;
    if (options.scope === "organization") {
      res = await TicketService.ticketOrg(page, filters);
    } else {
      res = await TicketService.advancedSearch(filters);
    }

    // Parse response safely
    const ticketsData = res.data?.data?.tickets?.data || [];
    const current = res.data?.data?.tickets?.current_page || 1;
    const last = res.data?.data?.tickets?.last_page || 1;

    tickets.value = ticketsData.map(transformTicket);
    currentPage.value = current;
    lastPage.value = last;

  } catch (err) {
    error.value = err;
    console.error("FETCH ERROR:", err.response || err);
  } finally {
    loading.value = false;
  }
};

  // -----------------------------
  // Fetch dashboard counts
  // -----------------------------
  const fetchCounts = async () => {
    try {
      const res = await TicketService.getStatusCounts();
      stats.value = res.data.counts || {};
    } catch (err) {
      console.error("Stats Error:", err);
    }
  };

  // -----------------------------
  // Pagination helper
  // -----------------------------
  const goToPage = (page) => {
    if (page < 1 || page > lastPage.value) return;
    currentPage.value = page;
    fetchTickets(page);
  };

  // -----------------------------
  // Watchers
  // -----------------------------
  watch([searchQuery, activeFilter, priorityFilter, organizationFilter], () => {
  fetchTickets(1);
}, { deep: true });

  // -----------------------------
  // On mounted
  // -----------------------------
  onMounted(() => {
    fetchTickets(currentPage.value);
    fetchCounts();
  });

  // -----------------------------
  // Return
  // -----------------------------
  return {
    tickets,
    stats,
    currentPage,
    lastPage,
    loading,
    error,
    activeFilter,
    searchQuery,
    priorityFilter,
    organizationFilter,
    fetchTickets,
    goToPage,
  };
}