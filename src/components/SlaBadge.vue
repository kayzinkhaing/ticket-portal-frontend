<template>
  <span class="inline-flex items-center gap-1.5">
    <span class="w-[7px] h-[7px] rounded-full shrink-0" :style="dotStyle"></span>
    <span class="text-[11px] font-semibold tracking-wide uppercase" :style="textStyle">{{ sla }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ sla: { type: String, required: true } })

const dotStyle = computed(() => ({
  'BREACHED': 'background-color:#ef4444;',
  'ON TRACK': 'background-color:#22c55e;',
  'DUE SOON': 'background-color:#f59e0b;',
  'COMPLETED': 'background-color:#22c55e;',
}[props.sla.toUpperCase()] ?? 'background-color:#6b7280;'))

const textStyle = computed(() => ({
  'BREACHED': 'color:#f87171;',
  'ON TRACK': 'color:#4ade80;',
  'DUE SOON': 'color:#fbbf24;',
  'COMPLETED': 'color:#4ade80;',
}[props.sla.toUpperCase()] ?? 'color:#6b7280;'))
</script>