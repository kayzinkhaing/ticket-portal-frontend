<template>
  <div class="bg-[#0f1715] border border-emerald-900/30 rounded-3xl p-6">
    <div class="flex items-center gap-2 mb-4">
      <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
      <h3 class="text-emerald-500 uppercase text-[10px] font-bold tracking-widest">System Status</h3>
    </div>
    <p class="text-xs text-emerald-400/70 leading-relaxed mb-6">
      SLA monitoring engine is active and processing {{ ticketCount.toLocaleString() }} tickets.
    </p>
    <div class="w-full bg-emerald-950 h-1.5 rounded-full mb-2">
      <div class="bg-emerald-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-1000" :style="{ width: load + '%' }"></div>
    </div>
    <div class="flex justify-between text-[10px] font-mono text-emerald-700/80">
      <span>Load: {{ loadStatus }}</span>
      <span>{{ uptime }}% Uptime</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ticketCount: { type: Number, default: 0 },
  load: { type: Number, default: 0 },
  loadStatus: { type: String, default: 'Optimal' },
  uptime: { type: Number, default: 99.9 }
});
</script>