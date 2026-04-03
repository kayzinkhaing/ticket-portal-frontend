<template>
  <router-link :to="to" custom v-slot="{ isActive, navigate }">
    <button
      @click="navigate"
      class="w-full flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] font-medium transition-colors duration-150 relative"
      :style="isActive
        ? 'background-color: #252a3d; color: #e8eaf6;'
        : 'color: #9ca3af; background-color: transparent;'"
      @mouseenter="e => { if (!isActive) { e.currentTarget.style.backgroundColor = '#1e2235'; e.currentTarget.style.color = '#e8eaf6'; }}"
      @mouseleave="e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}"
    >
      <!-- Active left accent bar -->
      <span
        v-if="isActive"
        class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
        style="background-color: #5c6bc0;"
      ></span>

      <!-- Icon -->
      <span class="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
        <svg v-if="icon === 'mail'"         class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        <svg v-if="icon === 'grid'"         class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        <svg v-if="icon === 'chat'"         class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        <svg v-if="icon === 'check-circle'" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <svg v-if="icon === 'warning'"      class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <svg v-if="icon === 'building'"     class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        <svg v-if="icon === 'users'"        class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </span>

      <!-- Label -->
      <span class="flex-1 text-left">{{ label }}</span>

      <!-- Count badge -->
      <SidebarBadge v-if="count !== undefined" :count="count" :variant="countVariant" />
    </button>
  </router-link>
</template>

<script setup>
import SidebarBadge from './SidebarBadge.vue'

defineProps({
  to:           { type: String,  required: true },
  label:        { type: String,  required: true },
  icon:         { type: String,  required: true },
  count:        { type: Number,  default: undefined },
  countVariant: { type: String,  default: 'default' },
})
</script>