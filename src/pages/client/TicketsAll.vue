<script setup>
import { ref } from "vue";
import TicketPageLayout from "@/components/TicketPageLayout.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useTickets } from "@/composables/useTickets";
import { watch } from "vue";
// Client scope
const {
  tickets,
  stats,
  currentPage,
  lastPage,
  loading,
  error,
  searchQuery,
  activeFilter,
  priorityFilter,
  organizationFilter,
  fetchTickets,
} = useTickets({ scope: "organization" });

// Handle pagination & filters from layout
const handlePage = (page) => {
  currentPage.value = page;
  fetchTickets(page);
};
watch(
  [searchQuery, activeFilter, priorityFilter, organizationFilter],
  () => {
    currentPage.value = 1;
    fetchTickets(1, {
      keyword: searchQuery.value,
      statusId: activeFilter.value !== "All" ? activeFilter.value : "",
      priorityId: priorityFilter.value,
      organizationId: organizationFilter.value,
    });
  }
);
const handleFilters = (f) => {
  searchQuery.value = f.keyword || "";
  activeFilter.value = f.statusId || "All";
  priorityFilter.value = f.priorityId || "";
  organizationFilter.value = f.organizationId || "";
  currentPage.value = 1;
  fetchTickets(1);
};
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <p v-else-if="error" class="text-red-500 text-center p-10">
      Failed to load tickets
    </p>

    <TicketPageLayout
  v-if="!loading && !error"
  title="Client Tickets"
  subtitle="Tickets in your organization"
  :filtered="tickets"
  :stats="stats"
  :currentPage="currentPage"
  :lastPage="lastPage"
  v-model:activeFilter="activeFilter"
  v-model:searchQuery="searchQuery"
  v-model:priorityFilter="priorityFilter"
  v-model:organizationFilter="organizationFilter"
  @update:filters="handleFilters"
  @update:currentPage="handlePage"
  mode="client"
/>
  </div>
</template>