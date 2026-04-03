<template>
  <TicketPageLayout
    title="Overdue Tickets"
    subtitle="Tickets that have breached their SLA and require immediate action."
    v-model:activeFilter="activeFilter"
    v-model:searchQuery="searchQuery"
    :stats="stats"
    :filtered="filtered"
  />
</template>

<script setup>
import TicketPageLayout from '@/components/TicketPageLayout.vue'
import { useTickets }   from '@/composables/useTickets'

const { searchQuery, activeFilter, filtered, stats } = useTickets('OVERDUE')
</script>