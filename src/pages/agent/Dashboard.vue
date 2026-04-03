<template>
    <div class="space-y-8 animate-fadein">

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="s in dashboard.stats" :key="s.label" class="glass-card rounded-2xl p-5 transition-all cursor-default">
          <p class="text-[10px] uppercase tracking-widest font-semibold" :class="s.color">{{ s.label }}</p>
          <p class="text-4xl font-bold text-white mt-2 mb-1" style="font-family:'Syne',sans-serif">{{ s.value }}</p>
          <p class="text-white/40 text-xs">{{ s.sub }}</p>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="flex items-center gap-3 flex-wrap">
        <div class="glass-input flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 min-w-48 max-w-sm">
          <svg class="w-4 h-4 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="search" placeholder="Search tickets…" class="bg-transparent text-white/80 placeholder-white/30 text-sm outline-none w-full" />
        </div>

        <button v-for="f in filters" :key="f"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all"
          :class="activeFilter === f ? 'bg-violet-500/20 text-violet-300 border border-violet-400/30' : 'glass-input text-white/50 hover:text-white/80'"
          @click="activeFilter = f">{{ f }}</button>
      </div>

      <!-- Tickets Table -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="grid grid-cols-12 px-6 py-3 border-b border-white/5">
          <span class="col-span-5 text-white/30 text-[10px] uppercase tracking-widest">Ticket</span>
          <span class="col-span-2 text-white/30 text-[10px] uppercase tracking-widest">Status</span>
          <span class="col-span-2 text-white/30 text-[10px] uppercase tracking-widest">Priority</span>
          <span class="col-span-2 text-white/30 text-[10px] uppercase tracking-widest">SLA</span>
          <span class="col-span-1 text-white/30 text-[10px] uppercase tracking-widest">Created</span>
        </div>

        <div v-for="t in filteredTickets" :key="t.id"
          class="grid grid-cols-12 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition cursor-pointer group items-center"
          @click="$router.push('/client/tickets/' + t.id)">
          <div class="col-span-5">
            <p class="text-white/25 text-[10px] mb-0.5 font-mono">{{ t.id }}</p>
            <p class="text-white/80 text-sm group-hover:text-violet-300 transition">{{ t.title }}</p>
          </div>
          <div class="col-span-2">
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide" :class="statusStyle(t.status)">
              {{ t.status }}
            </span>
          </div>
          <div class="col-span-2 flex items-center gap-1.5">
            <span class="font-semibold text-xs" :class="priorityColor(t.priority)">{{ priorityIcon(t.priority) }}</span>
            <span class="text-white/50 text-xs">{{ t.priority }}</span>
          </div>
          <div class="col-span-2 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="slaDot(t.sla)"></span>
            <span class="text-xs text-white/50">{{ t.sla }}</span>
          </div>
          <div class="col-span-1 text-white/30 text-xs">{{ t.date }}</div>
        </div>
      </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'


const search = ref('')
const activeFilter = ref('')
const filters = ['High Priority', 'Overdue']

const dashboard = useDashboardStore()

// Fetch real stats + tickets on mount
onMounted(async () => {
  await dashboard.fetchDashboard()
})

// Filter tickets dynamically
const filteredTickets = computed(() => {
  return dashboard.tickets
    .filter(t => t.title.toLowerCase().includes(search.value.toLowerCase()))
    .filter(t => !activeFilter.value || t.priority === activeFilter.value || t.status === activeFilter.value)
})

// Helpers for styling
const statusStyle = s => ({
  'Overdue': 'bg-red-500/20 text-red-400',
  'In Progress': 'bg-blue-500/20 text-blue-400',
  'Open': 'bg-emerald-500/20 text-emerald-400',
  'Resolved': 'bg-teal-500/20 text-teal-400'
}[s] || 'bg-white/10 text-white/40')

const priorityColor = p => ({
  'Critical': 'text-red-400',
  'High': 'text-orange-400',
  'Medium': 'text-yellow-400',
  'Low': 'text-white/30'
}[p])

const priorityIcon = p => ({
  'Critical': '↑↑',
  'High': '↑',
  'Medium': '—',
  'Low': '↓'
}[p])

const slaDot = s => ({
  'Breached': 'bg-red-400',
  'Due Soon': 'bg-orange-400',
  'On Track': 'bg-emerald-400',
  'Completed': 'bg-teal-400'
}[s] || 'bg-white/20')
</script>

<style scoped>
.glass-card { background: rgba(255,255,255,0.04); backdrop-filter: blur(24px); border:1px solid rgba(255,255,255,0.07); }
.glass-input { background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); }
@keyframes fadein { from{opacity:0; transform:translateY(16px);} to{opacity:1; transform:translateY(0);} }
.animate-fadein { animation: fadein 0.5s cubic-bezier(.22,1,.36,1) both; }
</style>