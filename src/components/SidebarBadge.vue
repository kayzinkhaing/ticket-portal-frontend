<template>
  <span
    class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[11px] font-semibold"
    :style="styles"
  >{{ count }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count:   { type: Number, required: true },
  variant: { type: String, default: 'default' }, // 'default' | 'indigo' | 'red'
})

const styles = computed(() => {
  if (props.variant === 'indigo') return 'background-color: #312e81; color: #a5b4fc;'
  if (props.variant === 'red')    return 'background-color: #7f1d1d; color: #fca5a5;'
  return 'background-color: #252a3d; color: #6b7280;'
})
</script>