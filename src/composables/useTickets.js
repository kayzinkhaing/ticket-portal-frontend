import { ref, onMounted } from "vue";
import { TicketService } from "../services/TicketService";

export function useTickets(options = { scope: "all" }) {
  const tickets = ref([]);
  const stats = ref({});
  const loading = ref(false);
  const error = ref(null);

  const currentPage = ref(1);
  const lastPage = ref(1);

  // ✅ SINGLE SOURCE OF TRUTH
  const filters = ref({
    keyword: "",
    status_id: [],
    priority_id: [],
    organization_id: null,
    date_from: null,
    date_to: null,
  });

  // -----------------------------
  // Transform API → UI
  // -----------------------------
  const transformTicket = (t) => ({
    id: t.id,
    title: t.title,
    desc: t.description || "-",
    client: t.client_profile?.user
      ? `${t.client_profile.user.first_name} ${t.client_profile.user.last_name}`
      : "Unknown",
    agent: t.assigned_to
      ? `${t.assigned_to.first_name || ""} ${t.assigned_to.last_name || ""}`
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
  const fetchTickets = async (page = 1, overrideFilters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const payload = {
        ...filters.value,
        ...overrideFilters,
        page,
      };

      console.log("FINAL API PAYLOAD:", payload);

      let res;
      if (options.scope === "organization") {
        res = await TicketService.ticketOrg(page, payload);
      } else {
        res = await TicketService.advancedSearch(payload);
      }

      const ticketsData = res.data?.data?.tickets?.data || [];

      tickets.value = ticketsData.map(transformTicket);
      currentPage.value = res.data?.data?.tickets?.current_page || 1;
      lastPage.value = res.data?.data?.tickets?.last_page || 1;

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
  // Pagination
  // -----------------------------
  const goToPage = (page) => {
    if (page < 1 || page > lastPage.value) return;
    currentPage.value = page;
    fetchTickets(page);
  };

  // -----------------------------
  // Init
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
    filters,        // ✅ ONLY FILTER
    fetchTickets,
    goToPage,
  };
}