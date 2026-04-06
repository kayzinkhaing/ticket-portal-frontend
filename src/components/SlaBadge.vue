<template>
  <div class="flex items-center gap-2">
    <span class="inline-block w-2 h-2 rounded-full" :style="{ backgroundColor: dotColor }"></span>
    <span class="text-[11px] font-medium" :style="{ color: textColor }">
      {{ safeSla }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  sla: {
    type: String,
    default: ''
  }
})

const safeSla = computed(() => (props.sla || 'ON TRACK').toUpperCase())

const dotColor = computed(() => {
  const map = {
    'BREACHED': '#ef4444',
    'ON TRACK': '#22c55e',
    'DUE SOON': '#f59e0b',
    'COMPLETED': '#22c55e'
  }
  return map[safeSla.value] || '#6b7280'
})

const textColor = computed(() => {
  const map = {
    'BREACHED': '#f87171',
    'ON TRACK': '#4ade80',
    'DUE SOON': '#fbbf24',
    'COMPLETED': '#4ade80'
  }
  return map[safeSla.value] || '#6b7280'
})
</script>