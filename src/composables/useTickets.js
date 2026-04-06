// src/composables/useTickets.js
import { ref, onMounted, watch, isRef } from "vue";
import { TicketService } from "../services/TicketService";
import { StatusService } from "../services/StatusService";
import { PriorityService } from "../services/PriorityService";
import { OrganizationService } from "../services/OrganizationService";

export function useTickets(options = { scope: "all", forcedOrgId: null }) {
  const tickets = ref([]);
  const stats = ref({});

  const statuses = ref([]);
  const priorities = ref([]);
  const organizations = ref([]);

  const pageLoading = ref(true);
  const tableLoading = ref(false);

  const error = ref(null);
  const currentPage = ref(1);
  const lastPage = ref(1);

  const cache = new Map();
  const agentMap = ref(new Map());

  const getForcedId = () =>
    isRef(options.forcedOrgId)
      ? options.forcedOrgId.value
      : options.forcedOrgId;

  const filters = ref({
    keyword: "",
    status_id: [],
    priority_id: [],
    organization_id: getForcedId(),
    date_from: null,
    date_to: null,
  });

  const fetchDropdowns = async () => {
    try {
      const [s, p, o] = await Promise.all([
        StatusService.getAll(),
        PriorityService.getAll(),
        OrganizationService.getAll(),
      ]);
      statuses.value = s || [];
      priorities.value = p || [];
      organizations.value = o || [];
    } catch (err) {
      console.error("Dropdown fetch error:", err);
    }
  };

  // ✅ Fixed: extract the array from res.data.data
  const fetchAgents = async () => {
    try {
      const res = await TicketService.getAgents();
      const agents = res.data?.data || []; // 👈 correct path
      if (!Array.isArray(agents)) {
        console.error("Agents response is not an array:", agents);
        return;
      }
      agentMap.value = new Map(
        agents.map(agent => [agent.id, `${agent.first_name} ${agent.last_name}`])
      );
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  const getSlaStatus = (deadline) => {
    if (!deadline) return "ON TRACK";
    const now = new Date();
    const due = new Date(deadline);
    const diffHours = (due - now) / (1000 * 60 * 60);
    if (diffHours < 0) return "BREACHED";
    if (diffHours < 24) return "DUE SOON";
    return "ON TRACK";
  };

  const transformTicket = (t) => ({
    id: t.id,
    title: t.title || "Untitled",
    desc: t.description || "-",
    client: t.client_profile?.user
      ? `${t.client_profile.user.first_name} ${t.client_profile.user.last_name}`
      : "Unknown",
    agent: t.assigned_to && agentMap.value.has(t.assigned_to)
      ? agentMap.value.get(t.assigned_to)
      : "Unassigned",
    status: t.status?.name || "Open",
    priority: t.priority?.name || "Low",
    created: t.created_at ? new Date(t.created_at).toLocaleDateString() : "-",
    sla: getSlaStatus(t.sla_deadline),
  });

  const fetchTickets = async (page = 1, overrideFilters = {}, isInitial = false) => {
    const currentId = getForcedId();

    if (Object.keys(overrideFilters).length) {
      const cleanOverride = {};
      for (const [key, val] of Object.entries(overrideFilters)) {
        if (val !== undefined) {
          cleanOverride[key] = val;
        }
      }
      filters.value = { ...filters.value, ...cleanOverride };
    }

    const payload = { ...filters.value, page };

    if (options.scope === "organization" && currentId) {
      payload.organization_id = currentId;
    }

    const key = JSON.stringify(payload);

    if (cache.has(key)) {
      const cached = cache.get(key);
      tickets.value = cached.tickets;
      currentPage.value = cached.currentPage;
      lastPage.value = cached.lastPage;
      return;
    }

    isInitial ? (pageLoading.value = true) : (tableLoading.value = true);

    try {
      const res = await TicketService.advancedSearch(payload);
      const ticketsPaginated = res.data?.data?.tickets;
      const ticketsArray = ticketsPaginated?.data || [];

      const mapped = ticketsArray.map(transformTicket);

      tickets.value = mapped;
      currentPage.value = ticketsPaginated?.current_page || 1;
      lastPage.value = ticketsPaginated?.last_page || 1;

      cache.set(key, {
        tickets: mapped,
        currentPage: currentPage.value,
        lastPage: lastPage.value,
      });
    } catch (err) {
      error.value = err;
    } finally {
      pageLoading.value = false;
      tableLoading.value = false;
    }
  };

  const fetchCounts = async () => {
    try {
      const res = await TicketService.getStatusCounts();
      stats.value = res.data?.counts || {};
    } catch (err) {
      console.error(err);
    }
  };

  if (isRef(options.forcedOrgId)) {
    watch(
      options.forcedOrgId,
      (id) => {
        if (!id) return;
        filters.value.organization_id = id;
        fetchTickets(1, {}, true);
        fetchCounts();
      },
      { immediate: true }
    );
  }

  onMounted(() => {
    fetchDropdowns();
    fetchAgents(); // ✅ will now work
    if (options.scope === "all") {
      fetchTickets(1, {}, true);
      fetchCounts();
    }
  });

  return {
    tickets,
    stats,
    statuses,
    priorities,
    organizations,
    currentPage,
    lastPage,
    pageLoading,
    tableLoading,
    error,
    filters,
    fetchTickets,
  };
}