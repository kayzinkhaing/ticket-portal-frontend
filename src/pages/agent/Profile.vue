<template>
  <div class="animate-fadein max-w-5xl mx-auto px-10 py-10 space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-white" style="font-family:'Syne',sans-serif">Agent Profile</h1>
      <p class="text-white/40 text-sm mt-1">Configure your workspace and identity</p>
    </div>

    <div class="glass-card rounded-2xl p-8 flex items-center gap-8">
      <div v-if="!user?.image" class="w-24 h-24 rounded-2xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-4xl font-bold text-indigo-300 uppercase">
        {{ initials }}
      </div>
      <img v-else :src="user.image" class="w-24 h-24 rounded-2xl object-cover border border-white/10" />

      <div class="flex-1">
        <p class="text-white font-semibold text-xl" style="font-family:'Syne',sans-serif">{{ form.first_name }} {{ form.last_name }}</p>
        <p class="text-white/40 text-sm uppercase text-[10px] tracking-widest">{{ user?.role }}</p>
        <div class="flex items-center gap-2 mt-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-white/40 text-xs">System Active</span>
        </div>
      </div>
      <button class="glass-input px-5 py-2.5 rounded-xl text-white/50 hover:text-white/80 text-sm transition">Upload New</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="glass-card rounded-2xl p-7 space-y-5">
          <h2 class="text-white/40 text-[10px] uppercase tracking-widest">Agent Information</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">First Name</label>
              <input v-model="form.first_name" class="glass-input w-full px-4 py-3 rounded-xl text-white/80 text-sm outline-none focus:ring-1 focus:ring-indigo-400/50 transition" />
            </div>
            <div>
              <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Last Name</label>
              <input v-model="form.last_name" class="glass-input w-full px-4 py-3 rounded-xl text-white/80 text-sm outline-none focus:ring-1 focus:ring-indigo-400/50 transition" />
            </div>
          </div>
          <div>
            <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Official Email</label>
            <input :value="form.email" disabled class="glass-input w-full px-4 py-3 rounded-xl text-white/30 text-sm cursor-not-allowed" />
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="glass-card rounded-2xl p-7 space-y-5">
          <h2 class="text-white/40 text-[10px] uppercase tracking-widest">Access Control</h2>
          <div>
            <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Update Password</label>
            <input v-model="form.password" type="password" placeholder="Leave blank to keep current" class="glass-input w-full px-4 py-3 rounded-xl text-white/80 placeholder-white/25 text-sm outline-none focus:ring-1 focus:ring-indigo-400/50 transition" />
          </div>
        </div>

        <button @click="saveChanges" :disabled="loading" class="w-full px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition hover:shadow-[0_0_24px_rgba(79,70,229,0.4)]">
          {{ loading ? 'Processing...' : 'Apply Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const auth = useAuthStore()
const user = computed(() => auth.user)
const loading = ref(false)

const form = ref({ first_name: '', last_name: '', email: '', password: '' })

const initials = computed(() => `${user.value?.first_name?.[0] || ''}${user.value?.last_name?.[0] || ''}`.toUpperCase())

const resetForm = () => {
  if (user.value) {
    form.value.first_name = user.value.first_name
    form.value.last_name = user.value.last_name
    form.value.email = user.value.email
  }
}

const saveChanges = async () => {
  loading.value = true
  try {
    const res = await axios.patch('/api/v1/profile', form.value)
    auth.user = res.data.user
    alert('Agent profile synced!')
  } catch (e) {
    alert('Sync failed.')
  } finally {
    loading.value = false
  }
}

onMounted(resetForm)
</script>

<style scoped>
.glass-card { background:rgba(255,255,255,0.04);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.07); }
.glass-input { background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08); }
@keyframes fadein { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.animate-fadein { animation:fadein 0.5s cubic-bezier(.22,1,.36,1) both; }
</style>