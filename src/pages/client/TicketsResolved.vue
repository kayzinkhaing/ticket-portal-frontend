<template>
  <TicketPageLayout
    title="Resolved Tickets"
    subtitle="Tickets that have been successfully closed this month."
    v-model:activeFilter="activeFilter"
    v-model:searchQuery="searchQuery"
    :stats="stats"
    :filtered="filtered"
  />
</template>

<script setup>
import TicketPageLayout from '@/components/TicketPageLayout.vue'
import { useTickets }   from '@/composables/useTickets'

const { searchQuery, activeFilter, filtered, stats } = useTickets('RESOLVED')
</script>