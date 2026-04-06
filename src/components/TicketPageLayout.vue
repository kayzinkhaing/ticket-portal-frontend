<template>
  <div class="px-7 py-7 space-y-5">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-[20px] font-semibold tracking-tight text-[#e8eaf6]">
          {{ title }}
        </h1>
        <p class="text-[13px] mt-1 max-w-md leading-relaxed text-[#6b7280]">
          {{ subtitle }}
        </p>
      </div>

      <button
        v-if="mode !== 'agent'"
        @click="handleCreate"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca]"
      >
        + New Ticket
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        v-for="(count, key) in mainStatusStats"
        :key="key"
        :label="formatLabel(key)"
        :count="count"
        sub="Tickets"
      />
    </div>

    <!-- Filters -->
    <AdvancedSearch
      :initialFilters="filters"
      :statuses="statuses"
      :priorities="priorities"
      :organizations="organizations"
      :hideOrg="hideOrg"
      @update:filters="emit('update:filters', $event)"
    />

    <!-- Table + Loading Overlay -->
    <div class="relative z-0">
      <div
        v-if="tableLoading"
        class="absolute inset-0 bg-black/40 flex items-center justify-center z-10"
      >
        <LoadingSpinner size="sm" />
      </div>

      <TicketTable :tickets="filtered || []" :mode="mode" />
    </div>

    <!-- Pagination -->
    <div
      v-if="lastPage > 1"
      class="flex items-center justify-between bg-[#161824]/50 p-4 rounded-xl border border-white/5 mt-4"
    >
      <div class="text-[12px] text-[#6b7280]">
        Showing page
        <span class="text-white font-mono">{{ currentPage }}</span> of
        {{ lastPage }}
      </div>

      <div class="flex gap-1 items-center">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-[11px] font-bold rounded-lg bg-white/5 border border-white/10 disabled:opacity-20"
        >
          &laquo; Prev
        </button>

        <button
          v-for="p in lastPage"
          :key="p"
          @click="emit('update:currentPage', p)"
          :class="[
            p === currentPage
              ? 'bg-[#4f46e5] text-white'
              : 'bg-white/5 text-[#e8eaf6]',
          ]"
          class="px-3 py-1 text-[11px] font-bold rounded-lg border border-white/10"
        >
          {{ p }}
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === lastPage"
          class="px-3 py-1 text-[11px] font-bold rounded-lg bg-[#4f46e5] text-white"
        >
          Next &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

import StatCard from "@/components/StatCard.vue";
import AdvancedSearch from "@/components/AdvancedSearch.vue";
import TicketTable from "@/components/TicketTable.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const props = defineProps({
  title: String,
  subtitle: String,
  stats: Object,
  filtered: Array,
  hideOrg: Boolean,
  filters: Object,
  mode: String,
  currentPage: Number,
  lastPage: Number,
  tableLoading: Boolean,
  statuses: Array,
  priorities: Array,
  organizations: Array,
});

const emit = defineEmits(["update:filters", "update:currentPage"]);

const router = useRouter();

// Only re-compute stats when `stats` object changes
const mainStatusStats = computed(() => {
  if (!props.stats) return {};
  const allowedKeys = ["open", "in_progress", "resolved", "closed"];
  const obj = {};
  for (const key in props.stats) {
    const lower = key.toLowerCase();
    if (allowedKeys.includes(lower)) {
      obj[lower] = props.stats[key]; // ✅ always lowercase keys
    }
  }
  return obj;
});
console.log("mainStatusStats:", mainStatusStats.value);

// Label formatter
const formatLabel = (str) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

// Navigation
const handleCreate = () => router.push("/client/create-ticket");
const nextPage = () =>
  props.currentPage < props.lastPage &&
  emit("update:currentPage", props.currentPage + 1);
const prevPage = () =>
  props.currentPage > 1 && emit("update:currentPage", props.currentPage - 1);
</script>
