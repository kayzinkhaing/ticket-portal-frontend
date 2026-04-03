<template>
  <aside class="w-[220px] shrink-0 flex flex-col bg-white dark:bg-[#111318] border-r border-slate-100 dark:border-white/[0.05]">

    <!-- Logo -->
    <div class="px-6 py-5 flex items-center gap-2.5 border-b border-slate-100 dark:border-white/[0.05]">
      <div class="logo-icon">
        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"/>
        </svg>
      </div>
      <span class="title">SupportDesk</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <SidebarItem to="/tickets/open" label="Open" count="5" />
      <SidebarItem to="/tickets/all" label="All Tickets" count="12" />
      <SidebarItem to="/tickets/in-progress" label="In Progress" count="4" />
      <SidebarItem to="/tickets/resolved" label="Resolved" count="3" />
      <SidebarItem to="/tickets/overdue" label="Overdue" count="2" danger />
    </nav>

    <!-- User -->
    <div class="px-3 py-4 border-t border-slate-100 dark:border-white/[0.05]">
      <UserMenu @logout="$emit('logout')" />
    </div>

  </aside>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'
import UserMenu from './UserMenu.vue'

defineEmits(['logout'])
</script>

<style scoped>
.logo-icon {
  @apply w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center;
}
.title {
  @apply font-semibold text-[15px] text-slate-800 dark:text-white;
}
</style>