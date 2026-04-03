<template>
  <button
    class="px-4 py-[9px] rounded-lg text-[12px] font-medium transition-colors duration-150"
    :style="active
      ? 'background-color:#252a3d;border:1px solid #3730a3;color:#e8eaf6;'
      : 'background-color:transparent;border:1px solid #2a2f45;color:#6b7280;'"
    @click="$emit('click')"
  >{{ label }}</button>
</template>

<script setup>
defineProps({ label: { type: String, required: true }, active: { type: Boolean, default: false } })
defineEmits(['click'])
</script>