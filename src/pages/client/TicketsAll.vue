<script setup>
import { computed, watch } from "vue";
import { useTickets } from "@/composables/useTickets";
import TicketPageLayout from "@/components/TicketPageLayout.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useAuthStore } from "@/stores/auth";
import { debounce } from "lodash-es";

const auth = useAuthStore();
const clientOrgId = computed(() => auth.user?.organization?.id);

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
} = useTickets({
  scope: "organization",
  forcedOrgId: clientOrgId,
});

watch(clientOrgId, (id) => {
  if (id) fetchTickets(1, {}, true);
}, { immediate: true });

const handlePage = (page) => fetchTickets(page);

// ✅ CORRECT: use status_id, priority_id
const handleFilters = debounce((f) => {
  fetchTickets(1, {
    keyword: f.keyword,
    status_id: f.status_id,
    priority_id: f.priority_id,
  });
}, 400);
</script>

<template>
  <div>
    <LoadingSpinner v-if="pageLoading" size="lg" color="primary" />
    <TicketPageLayout
      v-else
      title="My Organization Tickets"
      subtitle="View and manage tickets for your company"
      :filtered="tickets"
      :stats="stats"
      :filters="filters"
      :statuses="statuses"
      :priorities="priorities"
      :hideOrg="true"
      :currentPage="currentPage"
      :lastPage="lastPage"
      :tableLoading="tableLoading"
      @update:filters="handleFilters"
      @update:currentPage="handlePage"
      mode="client"
    />
  </div>
</template>