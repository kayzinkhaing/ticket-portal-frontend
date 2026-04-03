//E:\htdocs\Ticket Portal\frontend\src\layouts\AgentLayout.vue
<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AppSidebar from "../components/AppSidebar.vue";
import AppTopbar from "../components/AppTopbar.vue";

const router = useRouter()
const auth = useAuthStore()

const handleLogout = async () => {
  await auth.logout()      // ✅ clear token + user
  router.push('/login')    // ✅ redirect
}
</script>

<template>
  <div class="flex h-screen overflow-hidden" style="background-color: #13151f; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;">
    
    <!-- ✅ CONNECT LOGOUT HERE -->
    <AppSidebar role="agent" @logout="handleLogout" />

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AppTopbar role="agent" />

      <main class="flex-1 overflow-y-auto p-0" style="background-color: #13151f;">
        <router-view />
      </main>
    </div>
  </div>
</template>