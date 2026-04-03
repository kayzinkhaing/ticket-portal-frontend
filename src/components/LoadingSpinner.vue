<template>
  <div class="flex items-center justify-center" role="status" aria-live="polite">
    <div
      class="animate-spin rounded-full border-solid border-t-transparent"
      :class="[sizeClass, colorClass]"
    ></div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "md", // sm | md | lg
    validator: (v) => ["sm", "md", "lg"].includes(v),
  },
  color: {
    type: String,
    default: "primary", // primary | white | gray
  },
});

// Size styles
const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-4 h-4 border-2";
    case "lg":
      return "w-12 h-12 border-4";
    default:
      return "w-8 h-8 border-4";
  }
});

// Color styles
const colorClass = computed(() => {
  switch (props.color) {
    case "white":
      return "border-white";
    case "gray":
      return "border-gray-400";
    default:
      return "border-[#6c8ef5]";
  }
});
</script>