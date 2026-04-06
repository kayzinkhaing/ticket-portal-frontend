<template>
  <div class="flex items-center gap-2 group cursor-default">
    <span class="relative flex h-2 w-2">
      <span
        class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40"
        :class="statusConfig.dot"
      ></span>
      <span
        class="relative inline-flex rounded-full h-2 w-2"
        :class="statusConfig.dot"
      ></span>
    </span>

    <span
      class="text-[11px] font-bold uppercase tracking-widest transition-colors duration-200"
      :class="statusConfig.text"
    >
      {{ safeStatus }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: { type: [String, Object], required: true },
});

// ✅ Normalize status (VERY IMPORTANT)
const safeStatus = computed(() => {
  if (typeof props.status === "string") return props.status.trim();
  if (typeof props.status === "object") return props.status?.name?.trim() || "";
  return "";
});

// ✅ SAFE CONFIG (NO CRASH EVER)
const statusConfig = computed(() => {
  const s = safeStatus.value.toUpperCase();

  const map = {
    OPEN: { text: "text-zinc-500", dot: "bg-zinc-500" },
    "IN PROGRESS": { text: "text-blue-400", dot: "bg-blue-400" },
    RESOLVED: { text: "text-emerald-400", dot: "bg-emerald-400" },
    CLOSED: { text: "text-gray-400", dot: "bg-gray-400" },
    OVERDUE: { text: "text-rose-500", dot: "bg-rose-500" },
  };

  // ✅ fallback prevents crash
  return map[s] || { text: "text-gray-400", dot: "bg-gray-400" };
});
</script>