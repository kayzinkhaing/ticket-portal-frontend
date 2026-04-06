<script setup>
import { useTickets } from "@/composables/useTickets";
import TicketPageLayout from "@/components/TicketPageLayout.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const {
  tickets,
  stats,
  currentPage,
  lastPage,
  pageLoading,
  tableLoading,
  filters,
  fetchTickets,
  statuses,
  priorities,
  organizations,
} = useTickets({ scope: "all" });

const handlePage = (page) => fetchTickets(page);

// ✅ CORRECT: use status_id, priority_id, organization_id
const handleFilters = (f) => {
  fetchTickets(1, {
    keyword: f.keyword,
    status_id: f.status_id,
    priority_id: f.priority_id,
    organization_id: f.organization_id,
  });
};
</script>

<template>
  <LoadingSpinner v-if="pageLoading" size="lg" color="primary" />
  <TicketPageLayout
    v-else
    :filtered="tickets"
    :stats="stats"
    :filters="filters"
    :currentPage="currentPage"
    :lastPage="lastPage"
    :tableLoading="tableLoading"
    :statuses="statuses"
    :priorities="priorities"
    :organizations="organizations"
    @update:filters="handleFilters"
    @update:currentPage="handlePage"
  />
</template>