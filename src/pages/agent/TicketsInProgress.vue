<template>
  <TicketPageLayout
    title="In Progress"
    subtitle="Tickets currently being worked on by your support team."
    v-model:activeFilter="activeFilter"
    v-model:searchQuery="searchQuery"
    :stats="stats"
    :filtered="filtered"
  />
</template>

<script setup>
import TicketPageLayout from '@/components/TicketPageLayout.vue'
import { useTickets }   from '@/composables/useTickets'

const { searchQuery, activeFilter, filtered, stats } = useTickets('in-progress')
</script>