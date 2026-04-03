<template>
  <!-- Show a loading screen while restoring user -->
  <div v-if="loading" class="h-screen flex items-center justify-center">
    <p class="text-gray-400">Loading...</p>
  </div>

  <!-- Render the actual app only after auth is ready -->
  <router-view v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const loading = ref(true) // ✅ Track restoration state

onMounted(async () => {
  if (auth.token && !auth.user) {
    try {
      await auth.fetchUser() // fetch user from backend using token
    } catch (e) {
      auth.logout() // clear token & user if invalid
    }
  }
  loading.value = false // ✅ done restoring
})
</script>