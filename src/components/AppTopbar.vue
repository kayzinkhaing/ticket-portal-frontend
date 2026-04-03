<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const dropdownOpen = ref(false)

const user = computed(() => auth.user)

// Computed for display name instead of email
const fullName = computed(() => {
  if (!user.value) return 'Loading...'
  return `${user.value.first_name} ${user.value.last_name}`
})

const initials = computed(() => {
  if (!user.value) return '??'
  return `${user.value.first_name?.[0] || ''}${user.value.last_name?.[0] || ''}`.toUpperCase()
})

const profileRoute = computed(() => {
  if (!user.value) return '/login'
  return user.value.role === 'agent' ? '/agent/profile' : '/client/profile'
})

const toggleDropdown = (e) => {
  e.stopPropagation()
  dropdownOpen.value = !dropdownOpen.value
}

const logout = async () => {
  await auth.logout()
  router.push('/login')
  dropdownOpen.value = false
}

const closeDropdown = () => (dropdownOpen.value = false)
onMounted(() => window.addEventListener('click', closeDropdown))
onUnmounted(() => window.removeEventListener('click', closeDropdown))

const goToProfile = () => {
  router.push(profileRoute.value)
  dropdownOpen.value = false
}
</script>

<template>
  <header class="h-[64px] flex items-center justify-end px-10 gap-6 sticky top-0 z-40 backdrop-blur-xl bg-[#0f111a]/70 border-b border-white/5">
    
    <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors cursor-default">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span class="text-[10px] font-bold tracking-[0.15em] text-emerald-500 uppercase">System Online</span>
    </div>

    <div class="relative">
      <button @click="toggleDropdown" class="flex items-center gap-4 group transition-all duration-300 active:scale-95">
        <div class="flex flex-col items-end hidden md:flex">
          <span class="text-sm font-medium text-white/90 group-hover:text-indigo-400 transition-colors">
            {{ fullName }}
          </span>
          <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            {{ user?.role || 'Guest' }}
          </span>
        </div>

        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white border border-white/10 shadow-xl shadow-indigo-500/10 rotate-3 group-hover:rotate-0 transition-all duration-300"
             style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">
          {{ initials }}
        </div>
      </button>

      <transition 
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0 translate-y-2"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 translate-y-2"
      >
        <div v-if="dropdownOpen" class="absolute right-0 mt-4 w-60 rounded-2xl border border-white/10 bg-[#161926]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50">
          <div class="px-4 py-3 mb-1">
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Session</p>
            <p class="text-sm font-semibold text-white truncate">{{ fullName }}</p>
            <p v-if="user?.organization" class="text-xs text-indigo-400/80 truncate">
              {{ user.organization.name }}
            </p>
          </div>

          <div class="h-[1px] bg-white/5 mx-2 mb-2"></div>

          <button @click="goToProfile" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2" stroke-linecap="round"/></svg>
            Account Settings
          </button>

          <button @click="logout" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all mt-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Sign Out
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>