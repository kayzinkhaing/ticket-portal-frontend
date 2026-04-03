<template>
  <div class="flex h-screen overflow-hidden" style="background-color: #13151f; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;">
    <AppSidebar @logout="handleLogout" />
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AppTopbar />
      <main class="flex-1 overflow-y-auto" style="background-color: #13151f;">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'   // ✅ ADD THIS
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar  from '@/components/AppTopbar.vue'

const router = useRouter()
const auth = useAuthStore() // ✅ ADD THIS

async function handleLogout() {
  await auth.logout()        // ✅ VERY IMPORTANT
  router.push('/login')      // ✅ redirect after clearing state
}
</script>