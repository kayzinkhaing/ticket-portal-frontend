<template>
  <div class="flex items-start justify-between" :class="{ 'opacity-50': disabled }">
    <div class="max-w-[80%]">
      <p class="text-sm font-medium text-gray-200">{{ label }}</p>
      <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ description }}</p>
    </div>
    <label class="switch">
      <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" :disabled="disabled">
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  description: String,
  modelValue: Boolean,
  disabled: Boolean
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.switch { position: relative; display: inline-block; width: 32px; height: 18px; flex-shrink: 0; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #2d2d3d; transition: .4s; }
.slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; transition: .4s; }
input:checked + .slider { background-color: #8b5cf6; }
.slider.round { border-radius: 34px; }
.slider.round:before { border-radius: 50%; }
input:checked + .slider:before { transform: translateX(14px); }
</style>