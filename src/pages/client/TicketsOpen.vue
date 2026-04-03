<template>
  <TicketPageLayout
    title="Open Tickets"
    subtitle="All currently open tickets waiting to be picked up."
    v-model:activeFilter="activeFilter"
    v-model:searchQuery="searchQuery"
    :stats="stats"
    :filtered="filtered"
  />
</template>

<script setup>
import TicketPageLayout from '@/components/TicketPageLayout.vue'
import { useTickets }   from '@/composables/useTickets'

const { searchQuery, activeFilter, filtered, stats } = useTickets('OPEN')
</script>