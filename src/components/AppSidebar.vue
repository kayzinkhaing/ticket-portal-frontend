<template>
  <aside
    class="w-[200px] shrink-0 h-full flex flex-col border-r border-white/5"
    style="background-color: #1a1d27;"
  >
    <div class="px-5 py-[18px] flex items-center border-b border-white/5">
      <div class="flex items-center gap-2">
        <div class="w-2 h-6 bg-indigo-500 rounded-full"></div>
        <span class="text-white font-bold text-[17px] tracking-tight" style="font-family:'Syne',sans-serif">
          {{ role === 'agent' ? 'AgentDesk' : 'SupportDesk' }}
        </span>
      </div>
    </div>

    <nav class="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar">

      <template v-if="role === 'agent'">
        <p class="text-[10px] font-bold tracking-[0.15em] uppercase px-3 pb-2 pt-1 text-gray-500/80">Queue</p>
        <SidebarLink :to="`/${role}/tickets/all`" label="All Tickets" icon="grid" />

        <p class="text-[10px] font-bold tracking-[0.15em] uppercase px-3 pb-2 pt-5 text-gray-500/80">Tools</p>
        <SidebarLink :to="`/${role}/dashboard`" label="Analytics" icon="chart" />
        <SidebarLink :to="`/${role}/sla-settings`" label="SLA Settings" icon="settings" />
      </template>

      <template v-else>
        <p class="text-[10px] font-bold tracking-[0.15em] uppercase px-3 pb-2 pt-1 text-gray-500/80">Tickets</p>
        <SidebarLink :to="`/${role}/tickets/all`" label="All Tickets" icon="grid" />

        <p class="text-[10px] font-bold tracking-[0.15em] uppercase px-3 pb-2 pt-6 text-gray-500/80">Workspace</p>
        
        <div v-if="userOrg" class="px-1">
          <SidebarLink 
            :to="`/${role}/organization/${userOrg.id}`" 
            :label="userOrg.name" 
            icon="building" 
            class="group hover:bg-indigo-500/5 transition-all duration-300 rounded-xl"
          />
        </div>
        
        <div v-else class="px-3 py-3 rounded-xl border border-dashed border-white/5 mx-1">
          <p class="text-[11px] text-white/20 italic text-center">No Org Assigned</p>
        </div>

        <p class="text-[10px] font-bold tracking-[0.15em] uppercase px-3 pb-2 pt-6 text-gray-500/80">Social</p>
        <SidebarLink :to="`/${role}/team-tickets`" label="Team Tickets" icon="users" />
      </template>

    </nav>

    <div class="px-4 py-4 border-t border-white/5">
      <button
        @click="$emit('logout')"
        class="group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300"
      >
        <div class="p-1.5 rounded-lg group-hover:bg-rose-500/10 transition-colors">
          <svg class="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </div>
        <span class="font-medium">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import SidebarLink from "./SidebarLink.vue"
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  role: {
    type: String,
    default: "client",
  },
})

defineEmits(["logout"])

// Initialize the Auth Store
const auth = useAuthStore()

/**
 * Access organization data from the existing session.
 * Change 'auth.user?.organization' if your key is named differently (e.g. auth.user?.org)
 */
const userOrg = computed(() => {
  return auth.user?.organization || null
})
</script>

<style scoped>
/* Custom slim scrollbar for a clean UI */
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

/* Smooth fade-in for sidebar content */
nav {
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>