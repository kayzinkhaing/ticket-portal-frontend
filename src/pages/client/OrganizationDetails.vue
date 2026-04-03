<template>
  <div class="animate-fadein max-w-5xl mx-auto px-10 py-10 space-y-8">
    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white" style="font-family:'Syne',sans-serif">
          {{ organization?.name || 'Loading...' }}
        </h1>
        <p class="text-white/40 text-sm mt-1">Organization Workspace & Team Members</p>
      </div>
      <div class="glass-card px-4 py-2 rounded-xl flex items-center gap-3">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span class="text-white/60 text-[10px] font-bold uppercase tracking-widest">Authorized Access</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="glass-card rounded-2xl p-6 border border-white/5">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-white font-semibold text-lg" style="font-family:'Syne',sans-serif">Team Members</h2>
            <span class="bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-1 rounded font-bold">
              {{ clients.length }} Members
            </span>
          </div>

          <div class="space-y-3">
            <div 
              v-for="client in clients" 
              :key="client.id" 
              class="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group"
            >
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-indigo-300 font-bold border border-white/5 group-hover:scale-105 transition-transform">
                {{ client.first_name.charAt(0) }}{{ client.last_name.charAt(0) }}
              </div>
              <div class="flex-1">
                <h3 class="text-white font-medium text-sm">{{ client.first_name }} {{ client.last_name }}</h3>
                <p class="text-white/30 text-xs">{{ client.email }}</p>
              </div>
              <div class="text-right">
                <p class="text-white/20 text-[10px] uppercase tracking-tighter">Member Since</p>
                <p class="text-white/40 text-[11px] font-mono">{{ formatDate(client.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="glass-card rounded-2xl p-6 space-y-6">
          <div>
            <label class="text-white/30 text-[10px] uppercase tracking-[0.2em] block mb-3">Organization Meta</label>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-white/50 text-xs">System ID</span>
                <span class="text-white font-mono text-xs">#00{{ organization.id }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-white/50 text-xs">Created</span>
                <span class="text-white text-xs">{{ formatDate(organization.created_at) }}</span>
              </div>
            </div>
          </div>
          
          <button class="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest transition shadow-lg shadow-indigo-900/20">
            View Org Tickets
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { OrganizationService } from '@/services/OrganizationService'

const route = useRoute()
const organization = ref({})
const clients = ref([])
const loading = ref(true)

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

onMounted(async () => {
  try {
    const res = await OrganizationService.getById(route.params.id)
    // Extracting based on your JSON structure: res.data.organization & res.data.clients
    organization.value = res.data.organization
    clients.value = res.data.clients
  } catch (err) {
    console.error("Error loading organization details:", err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
}
</style>