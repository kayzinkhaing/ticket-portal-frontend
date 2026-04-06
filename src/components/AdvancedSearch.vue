<template>
  <div class="relative z-30 flex flex-wrap items-center gap-4 py-2 px-4 bg-[#1f2233]/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm mb-4">
    <!-- Keyword -->
    <div class="relative flex-grow max-w-md">
      <span class="absolute inset-y-0 left-3 flex items-center text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        v-model="filters.keyword"
        type="text"
        placeholder="Search tickets..."
        class="bg-transparent border-none text-sm text-slate-200 placeholder-slate-500 focus:ring-0 w-full pl-10 py-2"
      />
    </div>

    <!-- Status / Priority dropdowns -->
    <DropdownFilter
      label="Status"
      :options="statuses"
      v-model:selected="filters.status_id"
      color="indigo"
    />
    <DropdownFilter
      label="Priority"
      :options="priorities"
      v-model:selected="filters.priority_id"
      color="rose"
    />

    <!-- Organization dropdown -->
    <div v-if="!hideOrg" class="relative flex items-center">
      <select
        v-model="filters.organization_id"
        class="appearance-none bg-transparent border-none text-xs text-slate-400 hover:text-slate-200 focus:ring-0 cursor-pointer pl-3 pr-8 py-2 rounded-lg hover:bg-white/5 transition-all"
      >
        <option value="" class="bg-[#1c1f2e] text-slate-300">All Organizations</option>
        <option v-for="o in organizations" :key="o.id" :value="o.id" class="bg-[#1c1f2e] text-slate-300">
          {{ o.name }}
        </option>
      </select>
      <svg class="h-3 w-3 absolute right-2 pointer-events-none text-slate-500 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M19 9l-7 7-7-7" stroke-width="2" />
      </svg>
    </div>

    <!-- Actions -->
    <div class="ml-auto flex items-center gap-3 pr-2">
      <button type="button" @click="resetFilters" class="text-xs font-medium text-slate-500 hover:text-white px-2 py-2">
        Reset
      </button>
      <button type="button" @click="applyFilters" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20">
        Apply Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import debounce from "lodash/debounce";
import DropdownFilter from "@/components/DropdownFilter.vue";

const props = defineProps({
  initialFilters: { type: Object, default: () => ({}) },
  statuses: { type: Array, default: () => [] },
  priorities: { type: Array, default: () => [] },
  organizations: { type: Array, default: () => [] },
  hideOrg: { type: Boolean, default: false },
});

const emit = defineEmits(["update:filters"]);

const filters = ref({
  keyword: "",
  status_id: [],
  priority_id: [],
  organization_id: "",
});

// Sync parent initialFilters → local
watch(
  () => props.initialFilters,
  (val) => {
    if (!val) return;
    filters.value = {
      keyword: val.keyword || "",
      status_id: val.status_id || [],
      priority_id: val.priority_id || [],
      organization_id: val.organization_id || "",
    };
  },
  { immediate: true, deep: true }
);

// Debounced emit for auto-apply (optional)
const debouncedEmit = debounce(() => {
  emit("update:filters", { ...filters.value });
}, 400);

watch(filters, debouncedEmit, { deep: true });

// Manual apply (for "Apply Filters" button)
const applyFilters = () => {
  emit("update:filters", { ...filters.value });
};

// Reset
const resetFilters = () => {
  filters.value = {
    keyword: "",
    status_id: [],
    priority_id: [],
    organization_id: "",
  };
  emit("update:filters", { ...filters.value });
};
</script>