<script setup>
import { ref, watch } from "vue";
import TicketPageLayout from "@/components/TicketPageLayout.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useTickets } from "@/composables/useTickets";

// ------------------------------
// 1️⃣ Choose scope: agent / client
const scope = "all"; // agent side
// const scope = "organization"; // client side

// ------------------------------
// 2️⃣ Composable
const {
  tickets,
  stats,
  activeFilter,
  searchQuery,
  priorityFilter,
  organizationFilter,
  currentPage,
  lastPage,
  loading,
  error,
  fetchTickets,
} = useTickets({ scope });

// ------------------------------
// 3️⃣ Pagination handler
const handlePage = (page) => {
  if (page < 1 || page > lastPage.value) return;
  currentPage.value = page;
  fetchTickets(page);
};

// ------------------------------
// 4️⃣ Filters handler
const handleFilters = () => {
  currentPage.value = 1;
  fetchTickets(1);
};

// ------------------------------
// 5️⃣ Watch filters / search changes
watch(
  [searchQuery, activeFilter, priorityFilter, organizationFilter],
  () => {
    handleFilters();
  }
);
</script>

<template>
  <div>
    <!-- Loading -->
    <LoadingSpinner v-if="loading" size="lg" color="primary" />

    <!-- Error -->
    <p v-else-if="error" class="text-red-500 p-10 text-center">
      Failed to load tickets.
    </p>

    <!-- Tickets -->
    <TicketPageLayout
      v-else
      title="All Tickets"
      subtitle="Tickets assigned or created"
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
      mode="agent"
    />
  </div>
</template>