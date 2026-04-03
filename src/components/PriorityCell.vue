<template>
  <div class="flex items-center gap-2 pl-2 border-l-2" :style="{ borderColor: config.hex }">
    <span class="text-[14px] leading-none" :class="config.color">
      {{ config.icon }}
    </span>
    <span class="text-[11px] font-semibold tracking-wide text-gray-300">
      {{ priority || 'Low' }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ priority: { type: String, default: 'Low' } })

const config = computed(() => {
  const p = (props.priority || 'low').toLowerCase()
  if (p === 'critical') return { icon: '◈', color: 'text-rose-500', hex: '#f43f5e' }
  if (p === 'high')     return { icon: '▲', color: 'text-orange-500', hex: '#f97316' }
  if (p === 'medium')   return { icon: '●', color: 'text-blue-400', hex: '#60a5fa' }
  return                       { icon: '▼', color: 'text-gray-500', hex: '#4b5563' }
})
</script>