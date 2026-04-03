<template>
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    @click.self="closeModal"
  >
    <div class="w-full max-w-2xl p-8 space-y-6 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl">

      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold text-white">Create New Ticket</h2>
          <p class="text-sm text-gray-400 mt-1">Fill out the details below to notify our support team.</p>
        </div>

        <button 
          @click="closeModal" 
          class="text-gray-400 hover:text-white transition-colors p-1"
        >
          <span class="text-2xl">✕</span>
        </button>
      </div>

      <div class="space-y-5">

        <div class="flex flex-col gap-2">
          <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Ticket Title</label>
          <input 
            v-model="form.title" 
            type="text"
            placeholder="e.g., Server connection timeout"
            :class="inputClass('title')" 
          />
          <p v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Description</label>
          <textarea 
            v-model="form.description" 
            rows="4" 
            placeholder="Describe the issue in detail..."
            :class="inputClass('description')" 
          />
          <p v-if="errors.description" class="text-xs text-red-500">{{ errors.description }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Priority Level</label>
          <select 
            v-model="form.priority_id" 
            @change="calculateSLA" 
            :class="inputClass('priority_id')"
          >
            <option value="">Select a priority...</option>
            <option v-for="p in priorities" :key="p.id" :value="p.id">
              {{ p.name }} — (SLA: {{ p.sla_hours }} hours)
            </option>
          </select>
          <p v-if="errors.priority_id" class="text-xs text-red-500">{{ errors.priority_id }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-medium uppercase tracking-wider text-gray-500">Expected Resolution Deadline</label>
          <div class="relative">
            <input
              :value="formattedSLA"
              disabled
              class="w-full p-3 rounded-xl bg-gray-900/50 border border-dashed border-gray-700 text-gray-400 cursor-not-allowed italic"
            />
          </div>
        </div>

      </div>

      <div class="flex justify-end items-center gap-4 pt-6 border-t border-white/5">
        <button 
          @click="closeModal" 
          class="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"
        >
          Cancel
        </button>
        
        <button 
          @click="submit" 
          :disabled="loading" 
          class="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ loading ? 'Creating...' : 'Create Ticket' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TicketService } from '@/services/TicketService'
import { PriorityService } from '@/services/PriorityService'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const emit = defineEmits(['close', 'created'])
const router = useRouter()
const auth = useAuthStore()

// State
const priorities = ref([])
const loading = ref(false)
const errors = ref({})

const form = ref({
  client_profile_id: auth.user?.client_profile?.id || null,
  created_by: auth.user?.id || null,
  title: '',
  description: '',
  priority_id: '',
  status_id: 1,
  sla_deadline: null
})

// --- API FETCHING ---
onMounted(async () => {
  try {
    const res = await PriorityService.getAll()
    // CORRECTED PATH: res.data.data.ticketpriorities.data
    priorities.value = res.data?.data?.ticketpriorities?.data || []
  } catch (err) {
    console.error('Priority Fetch Error:', err)
    toast.error('Could not load priority levels')
  }
})

// --- LOGIC ---
const calculateSLA = () => {
  const selected = priorities.value.find(p => p.id === form.value.priority_id)
  if (!selected) {
    form.value.sla_deadline = null
    return
  }
  const now = new Date()
  now.setHours(now.getHours() + selected.sla_hours)
  form.value.sla_deadline = now
}

const formattedSLA = computed(() => {
  if (!form.value.sla_deadline) return 'Calculation pending priority selection...'
  return new Date(form.value.sla_deadline).toLocaleString([], { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  })
})

const closeModal = () => {
  emit('close') // Signal to parent to hide modal
}

const inputClass = (field) => {
  const base = "w-full p-3 rounded-xl bg-gray-800 border transition-all outline-none text-white focus:ring-2 focus:ring-indigo-500/50"
  const state = errors.value[field] ? "border-red-500 bg-red-500/5" : "border-gray-700 focus:border-indigo-500"
  return `${base} ${state}`
}

const formatForBackend = (date) => {
  if (!date) return null
  const d = new Date(date)
  // Formats to YYYY-MM-DD HH:mm:ss
  return d.toISOString().slice(0, 19).replace('T', ' ')
}

// --- SUBMISSION ---
const submit = async () => {
  errors.value = {}

  if (!form.value.title) errors.value.title = 'Please provide a title'
  if (!form.value.description) errors.value.description = 'Description is required'
  if (!form.value.priority_id) errors.value.priority_id = 'Please select a priority'

  if (Object.keys(errors.value).length > 0) return

  loading.value = true
  try {
    const payload = {
      ...form.value,
      sla_deadline: formatForBackend(form.value.sla_deadline)
    }

    await TicketService.create(payload)
    
    toast.success('Ticket submitted successfully!')
    emit('created')
    closeModal()
    
    // Redirect after closing
    router.push('/client/tickets/all')
  } catch (err) {
    if (err.response?.status === 422) {
      const backendErrors = err.response.data.errors
      for (const key in backendErrors) {
        errors.value[key] = backendErrors[key][0]
      }
    } else {
      toast.error('An error occurred. Please try again.')
    }
  } finally {
    loading.value = false
  }
}
</script>