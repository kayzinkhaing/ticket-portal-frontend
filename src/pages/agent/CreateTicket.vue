<template>
    <div class="animate-fadein max-w-2xl">
      <button @click="$router.back()" class="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-6 transition">← Back</button>

      <h1 class="text-3xl font-bold text-white mb-1" style="font-family:'Syne',sans-serif">New Ticket</h1>
      <p class="text-white/40 text-sm mb-8">Describe your issue and we'll route it to the right team.</p>

      <div class="glass-card rounded-2xl p-8 space-y-6">
        <!-- Title -->
        <div>
          <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Title</label>
          <input v-model="form.title" type="text" placeholder="Brief description of the issue…"
            class="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-white/25 text-sm outline-none focus:ring-1 focus:ring-violet-400/50 transition" />
        </div>

        <!-- Priority & Category row -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Priority</label>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="p in priorities" :key="p.value"
                @click="form.priority=p.value"
                class="py-2.5 rounded-xl text-xs font-semibold border transition-all"
                :class="form.priority===p.value ? p.active : 'glass-input text-white/40 border-transparent hover:text-white/60'">
                {{ p.label }}
              </button>
            </div>
          </div>
          <div>
            <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Category</label>
            <select v-model="form.category"
              class="glass-input w-full px-4 py-3 rounded-xl text-white/70 text-sm outline-none focus:ring-1 focus:ring-violet-400/50 transition appearance-none">
              <option v-for="c in categories" :key="c" :value="c" class="bg-gray-900">{{ c }}</option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Description</label>
          <textarea v-model="form.description" rows="5" placeholder="Provide steps to reproduce, expected vs actual behavior, environment details…"
            class="glass-input w-full px-4 py-3 rounded-xl text-white/70 placeholder-white/25 text-sm outline-none focus:ring-1 focus:ring-violet-400/50 transition resize-none"></textarea>
        </div>

        <!-- Attachments -->
        <div>
          <label class="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Attachments</label>
          <div class="glass-input rounded-xl px-4 py-6 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-violet-400/30 transition">
            <svg class="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            <p class="text-white/30 text-xs">Drop files or click to upload</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-2">
          <button @click="$router.back()" class="flex-1 py-3 rounded-xl glass-input text-white/50 hover:text-white/80 text-sm transition">Cancel</button>
          <button @click="submit" class="flex-1 py-3 rounded-xl bg-violet-500/80 hover:bg-violet-500 text-white font-semibold text-sm transition hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]"
            style="font-family:'Syne',sans-serif">Submit Ticket</button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ClientLayout from '../../layouts/ClientLayout.vue'
const router = useRouter()
const form = ref({ title:'', priority:'High', category:'Infrastructure', description:'' })
const priorities = [
  { value:'Low', label:'Low', active:'bg-white/10 text-white/60 border-white/20' },
  { value:'Medium', label:'Medium', active:'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' },
  { value:'High', label:'High', active:'bg-orange-500/20 text-orange-300 border-orange-400/30' },
  { value:'Critical', label:'Critical', active:'bg-red-500/20 text-red-300 border-red-400/30' },
]
const categories = ['Infrastructure','Billing','API','Authentication','UI/UX','Other']
const submit = () => router.push('/client/tickets')
</script>

<style scoped>
.glass-card { background:rgba(255,255,255,0.04);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.07); }
.glass-input { background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08); }
@keyframes fadein { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.animate-fadein { animation:fadein 0.5s cubic-bezier(.22,1,.36,1) both; }
</style>