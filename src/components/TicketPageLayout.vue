<template>
  <div class="px-7 py-7 space-y-5">
    <!-- HEADER -->
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

    <!-- STATS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        v-for="(count, key) in mainStatusStats"
        :key="key"
        :label="formatLabel(key)"
        :count="count"
        sub="Tickets"
      />
    </div>

    <!-- FILTERS -->
    <!-- <TicketFilters
      :model-value="activeFilter"
      :availableStatuses="['All','Open','In Progress','Resolved','Closed','Unassigned','Overdue']"
      @update:model-value="emit('update:activeFilter', $event)"
      @search="emit('update:searchQuery', $event)"
    /> -->
    <AdvancedSearch @update:filters="emit('update:filters', $event)" />

    <!-- TABLE -->
    <TicketTable :tickets="filtered || []" :mode="mode" />

    <!-- PAGINATION -->
<div
  v-if="lastPage > 1"
  class="flex items-center justify-between bg-[#161824]/50 p-4 rounded-xl border border-white/5 mt-4"
>
  <!-- Info -->
  <div class="text-[12px] text-[#6b7280]">
    Showing page <span class="text-white font-mono">{{ currentPage }}</span>
    of {{ lastPage }}
  </div>

  <!-- Page Buttons -->
  <div class="flex gap-1 items-center">
    <!-- Previous Button -->
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="px-3 py-1 text-[11px] font-bold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20"
    >
      &laquo; Prev
    </button>

    <!-- Numbered Pages -->
    <button
      v-for="p in lastPage"
      :key="p"
      @click="emit('update:currentPage', p)"
      :class="[
        'px-3 py-1 text-[11px] font-bold rounded-lg border border-white/10 hover:bg-white/10',
        p === currentPage ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]' : 'bg-white/5 text-[#e8eaf6]'
      ]"
    >
      {{ p }}
    </button>

    <!-- Next Button -->
    <button
      @click="nextPage"
      :disabled="currentPage === lastPage"
      class="px-3 py-1 text-[11px] font-bold rounded-lg bg-[#4f46e5] text-white hover:bg-[#4338ca] disabled:opacity-20"
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
import TicketFilters from "@/components/TicketFilters.vue";
import AdvancedSearch from "@/components/AdvancedSearch.vue";
import TicketTable from "@/components/TicketTable.vue";

const router = useRouter();

const props = defineProps({
  title: String,
  subtitle: String,
  stats: Object,
  filtered: Array,
  activeFilter: String,
  searchQuery: String,
  priorityFilter: String,
  organizationFilter: String,
  mode: String,
  currentPage: Number,
  lastPage: Number,
});

// const emit = defineEmits([
//   "update:activeFilter",
//   "update:searchQuery",
//   "update:currentPage",
// ]);
const emit = defineEmits([
  "update:filters",
  "update:currentPage",
]);

function nextPage() {
  if (props.currentPage < props.lastPage) {
    emit("update:currentPage", props.currentPage + 1);
  }
}

function prevPage() {
  if (props.currentPage > 1) {
    emit("update:currentPage", props.currentPage - 1);
  }
}

const mainStatusStats = computed(() => {
  if (!props.stats) return {};
  const allowedKeys = ["open", "in_progress", "resolved", "closed"];
  return Object.keys(props.stats)
    .filter((key) => allowedKeys.includes(key.toLowerCase()))
    .reduce((obj, key) => {
      obj[key] = props.stats[key];
      return obj;
    }, {});
});

const formatLabel = (str) => str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

function handleCreate() {
  router.push("/client/create-ticket");
}
</script>