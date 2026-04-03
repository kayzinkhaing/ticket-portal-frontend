<script setup>
import { ref, computed, onMounted } from 'vue'
import TicketPageLayout from '@/components/TicketPageLayout.vue'
import { useTickets } from '@/composables/useTickets'

// Example user
const user = {
  role: 'Client',
  clientProfiles: [{ id: 4 }]
}

const { tickets, fetchTickets } = useTickets(user)

// Required states
const activeFilter = ref('in-progress')
const searchQuery = ref('')

// Filtered tickets
const filtered = computed(() => {
  return tickets.value.filter(t => t.status?.name === 'In Progress')
})

// Stats object (VERY IMPORTANT)
const stats = computed(() => ({
  open: tickets.value.filter(t => t.status?.name === 'Open').length,
  inProgress: tickets.value.filter(t => t.status?.name === 'In Progress').length,
  resolved: tickets.value.filter(t => t.status?.name === 'Resolved').length,
  overdue: tickets.value.filter(t => t.status?.name === 'Overdue').length,
}))

onMounted(fetchTickets)
</script>

<template>
  <TicketPageLayout
    title="In Progress"
    subtitle="Tickets currently being worked on by your support team."

    :stats="stats"
    :filtered="filtered"
    :activeFilter="activeFilter"
    :searchQuery="searchQuery"

    @update:activeFilter="val => activeFilter = val"
    @update:searchQuery="val => searchQuery = val"
  />
</template>