<template>
  <div class="rounded-xl overflow-hidden" style="background-color:#1e2130;border:1px solid #2a2f45;">
    <!-- Head -->
    <div class="hidden md:grid px-5 py-3" :style="gridStyle">
      <span v-for="col in columns" :key="col" class="text-[10px] font-semibold tracking-[0.1em] uppercase" style="color:#4a5568;">
        {{ col }}
      </span>
    </div>

    <!-- Rows -->
    <template v-if="tickets.length">
      <TicketRow
        v-for="(t,i) in tickets"
        :key="t.id || i"
        :ticket="t"
        :is-last="i === tickets.length - 1"
      />
    </template>

    <!-- Empty -->
    <div v-else class="py-14 text-center">
      <p class="text-[13px]" style="color:#6b7280;">No tickets found</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TicketRow from './TicketRow.vue'

const props = defineProps({
  tickets: { type: Array, required: true }
})

const columns = ['ID', 'Ticket', 'Client', 'Description', 'Status', 'Priority', 'SLA', 'Agent']

const gridStyle = 'grid-template-columns: 50px 2fr 1.5fr 3fr 120px 100px 100px 1.5fr; border-bottom:1px solid #252a3d;'
</script>