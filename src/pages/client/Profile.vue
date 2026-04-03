<template>
  <div class="animate-fadein max-w-5xl mx-auto px-12 py-10 space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-white" style="font-family:'Syne',sans-serif">Profile</h1>
      <p class="text-white/40 text-sm mt-1">Manage your account settings</p>
    </div>

    <div class="glass-card rounded-2xl p-8 flex items-center gap-8">
      <div v-if="!user?.image" class="w-24 h-24 rounded-2xl bg-violet-500/30 border border-violet-400/30 flex items-center justify-center text-4xl font-bold text-violet-300 uppercase" style="font-family:'Syne',sans-serif">
        {{ initials }}
      </div>
      <img v-else :src="user.image" class="w-24 h-24 rounded-2xl object-cover border border-white/10" />
      
      <div class="flex-1">
        <p class="text-white font-semibold text-xl" style="font-family:'Syne',sans-serif">{{ form.first_name }} {{ form.last_name }}</p>
        <p class="text-white/40 text-sm lowercase">{{ form.email }}</p>
        <div class="flex items-center gap-2 mt-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span class="text-white/40 text-xs">Active · {{ user?.organization?.name || 'Personal' }}</span>
        </div>
      </div>
      <button class="glass-input px-5 py-2.5 rounded-xl text-white/50 hover:text-white/80 text-sm transition">Change Photo</button>
    </div>

    <form @submit.prevent="saveChanges" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-8 space-y-6">
        <div class="glass-card rounded-2xl p-8 space-y-6">
          <h2 class="text-white/40 text-[10px] uppercase tracking-widest">Personal Information</h2>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">First Name</label>
              <input v-model="form.first_name" class="glass-input w-full px-4 py-3 rounded-xl text-white/80 text-sm outline-none focus:ring-1 focus:ring-violet-400/50 transition" />
            </div>
            <div>
              <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Last Name</label>
              <input v-model="form.last_name" class="glass-input w-full px-4 py-3 rounded-xl text-white/80 text-sm outline-none focus:ring-1 focus:ring-violet-400/50 transition" />
            </div>
          </div>
          <div>
            <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Email (Read Only)</label>
            <input :value="form.email" disabled class="glass-input w-full px-4 py-3 rounded-xl text-white/30 text-sm cursor-not-allowed outline-none" />
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-6">
        <div class="glass-card rounded-2xl p-7 space-y-5">
          <h2 class="text-white/40 text-[10px] uppercase tracking-widest">Security</h2>
          <div class="space-y-4">
            <div>
              <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">New Password</label>
              <input v-model="form.password" type="password" placeholder="••••••••" class="glass-input w-full px-4 py-3 rounded-xl text-white/80 placeholder-white/25 text-sm outline-none focus:ring-1 focus:ring-violet-400/50 transition" />
            </div>
            <div>
              <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Confirm Password</label>
              <input v-model="form.password_confirmation" type="password" placeholder="••••••••" class="glass-input w-full px-4 py-3 rounded-xl text-white/80 placeholder-white/25 text-sm outline-none focus:ring-1 focus:ring-violet-400/50 transition" />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <button type="submit" :disabled="loading" class="w-full px-6 py-4 rounded-xl bg-violet-500/80 hover:bg-violet-500 text-white text-sm font-semibold transition hover:shadow-[0_0_24px_rgba(139,92,246,0.5)] disabled:opacity-50">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
          <button type="button" @click="resetForm" class="w-full glass-input px-6 py-3 rounded-xl text-white/50 hover:text-white/80 text-sm transition">Reset Fields</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const auth = useAuthStore()
const user = computed(() => auth.user)
const loading = ref(false)

const form = ref({ first_name: '', last_name: '', email: '', password: '', password_confirmation: '' })

const initials = computed(() => `${user.value?.first_name?.[0] || ''}${user.value?.last_name?.[0] || ''}`.toUpperCase())

const resetForm = () => {
  if (user.value) {
    form.value.first_name = user.value.first_name
    form.value.last_name = user.value.last_name
    form.value.email = user.value.email
    form.value.password = ''
    form.value.password_confirmation = ''
  }
}

const saveChanges = async () => {
  loading.value = true
  try {
    const response = await axios.patch('/api/v1/profile', form.value)
    auth.user = response.data.user 
    alert('Profile updated successfully!')
  } catch (error) {
    alert('Failed to update profile')
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