<script setup>
import TicketPageLayout from "@/components/TicketPageLayout.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useTickets } from "@/composables/useTickets";

// scope
const scope = "all";

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
} = useTickets({ scope });

// ✅ Pagination
const handlePage = (page) => {
  if (page < 1 || page > lastPage.value) return;
  currentPage.value = page;
  fetchTickets(page);
};

// ✅ Filters
const handleFilters = (f) => {
  console.log("RECEIVED FILTERS:", f);

  filters.value = { ...f };
  currentPage.value = 1;
  fetchTickets(1);
};
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" size="lg" color="primary" />

    <p v-else-if="error" class="text-red-500 p-10 text-center">
      Failed to load tickets.
    </p>

    <TicketPageLayout
      v-else
      title="All Tickets"
      subtitle="Tickets assigned or created"
      :filtered="tickets"
      :stats="stats"
      :currentPage="currentPage"
      :lastPage="lastPage"
      @update:filters="handleFilters"
      @update:currentPage="handlePage"
      mode="agent"
    />
  </div>
</template>