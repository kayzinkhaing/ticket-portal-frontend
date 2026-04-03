<template>
  <!-- ================= DESKTOP ================= -->
  <div
    class="hidden md:grid px-5 py-[14px] items-center transition-colors duration-100 cursor-pointer"
    :style="[gridStyle, !isLast ? 'border-bottom:1px solid #1e2235;' : '']"
    @click="goToDetail"
    @mouseenter="e => e.currentTarget.style.backgroundColor = '#1a1d2e'"
    @mouseleave="e => e.currentTarget.style.backgroundColor = 'transparent'"
  >
    <span class="text-[12px] font-mono text-gray-400">
      {{ ticket.id ?? '-' }}
    </span>

    <p class="text-[13px] font-medium leading-snug pr-4 text-gray-200">
      {{ ticket.title }}
    </p>

    <!-- CLIENT -->
    <span class="text-[12px] text-gray-400">
      {{ ticket.client ?? '-' }}
    </span>

    <!-- DESCRIPTION -->
    <p
      class="text-[12px] text-gray-400 truncate max-w-[250px]"
      :title="ticket.desc"
    >
      {{ ticket.desc ?? '-' }}
    </p>

    <StatusBadge :status="ticket.status" />
    <PriorityCell :priority="ticket.priority" />
    <SlaBadge :sla="ticket.sla" />

    <!-- AGENT -->
    <span class="text-[12px] text-gray-500">
      {{ ticket.agent ?? 'Unassigned' }}
    </span>
  </div>

  <!-- ================= MOBILE ================= -->
  <div
    class="md:hidden px-4 py-4 space-y-2 cursor-pointer"
    :style="!isLast ? 'border-bottom:1px solid #1e2235;' : ''"
    @click="goToDetail"
  >
    <div class="flex items-start justify-between gap-3">
      <p class="text-[13px] font-medium leading-snug text-gray-200">
        {{ ticket.title }}
      </p>
      <StatusBadge :status="ticket.status" />
    </div>

    <p class="text-[12px] text-gray-400">
      {{ ticket.id }} • {{ ticket.client ?? '-' }} • {{ ticket.agent ?? 'Unassigned' }}
    </p>

    <p class="text-[12px] text-gray-400 truncate">
      {{ ticket.desc ?? '-' }}
    </p>

    <div class="flex items-center gap-4 flex-wrap">
      <PriorityCell :priority="ticket.priority" />
      <SlaBadge :sla="ticket.sla" />
      <span class="text-[12px] ml-auto text-gray-500">
        {{ ticket.created }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import StatusBadge from "./StatusBadge.vue";
import PriorityCell from "./PriorityCell.vue";
import SlaBadge from "./SlaBadge.vue";

const props = defineProps({
  ticket: { type: Object, required: true },
  isLast: { type: Boolean, default: false },
});

const router = useRouter();

const gridStyle = computed(() => {
  return "grid-template-columns: 50px 2fr 1.5fr 3fr 120px 100px 100px 1.5fr;";
});

function goToDetail() {
  if (!props.ticket?.id) return;

  const isAgent = window.location.pathname.includes("agent");

  const base = isAgent ? "/agent" : "/client";

  router.push(`${base}/tickets/${props.ticket.id}`);
}
</script>