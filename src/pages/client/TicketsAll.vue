<script setup>
import TicketPageLayout from "@/components/TicketPageLayout.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useTickets } from "@/composables/useTickets";

// ✅ use ONLY filters
const {
  tickets,
  stats,
  currentPage,
  lastPage,
  loading,
  error,
  filters,
  fetchTickets,
} = useTickets({ scope: "organization" });

// ✅ Pagination
const handlePage = (page) => {
  if (page < 1 || page > lastPage.value) return;
  currentPage.value = page;
  fetchTickets(page);
};

// ✅ Filters
const handleFilters = (f) => {
  console.log("RECEIVED FILTERS:", f);

  filters.value = { ...f };   // ✅ important
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
      @update:filters="handleFilters"
      @update:currentPage="handlePage"
      mode="client"
    />
  </div>
</template>