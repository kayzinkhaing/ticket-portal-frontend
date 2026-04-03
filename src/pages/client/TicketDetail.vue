<template>
  <main class="flex-1 p-8 bg-[#0b0c14] min-h-screen text-white font-sans relative">
    
    <Transition name="toast">
      <div v-if="showSuccessToast" class="fixed top-10 right-10 z-50 flex items-center gap-3 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50">
        <span class="text-lg">✅</span>
        <span class="font-medium text-sm">Message sent successfully!</span>
      </div>
    </Transition>

    <div v-if="loading" class="text-center py-20 text-lg font-medium text-violet-400 animate-pulse">
      Loading ticket details...
    </div>
    
    <div v-else-if="error" class="text-red-500 text-center py-20">
      <p>Failed to load ticket details.</p>
      <button @click="fetchTicketData" class="mt-4 text-violet-400 underline">Try Again</button>
    </div>

    <div v-else-if="ticket" class="max-w-[1400px] mx-auto animate-fadein">
      
      <div class="flex justify-between items-start mb-6">
        <div class="flex gap-4">
          <span :class="statusBadgeStyle(ticket.status?.name)" class="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            {{ ticket.status?.name || 'Open' }}
          </span>
          <span class="bg-[#1c1e2d] text-violet-400 border border-violet-500/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider font-mono">
            #TKT-{{ ticket.id }}
          </span>
        </div>
        <button @click="$router.back()" class="text-gray-500 hover:text-white transition text-sm flex items-center gap-2">
          <span>✕</span> Close
        </button>
      </div>

      <h1 class="text-3xl font-semibold mb-4" style="font-family: 'Syne', sans-serif;">{{ ticket.title }}</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-8 space-y-8">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="glass-card p-6 rounded-xl">
              <h3 class="text-gray-500 text-[10px] uppercase tracking-widest mb-4 font-bold">Priority</h3>
              <div class="flex items-center gap-2">
                <div :class="priorityDot(ticket.priority?.name)" class="w-2.5 h-2.5 rounded-full"></div>
                <span class="text-lg text-gray-200">{{ ticket.priority?.name || 'Medium' }}</span>
              </div>
            </div>
            <div class="glass-card p-6 rounded-xl">
              <h3 class="text-gray-500 text-[10px] uppercase tracking-widest mb-4 font-bold">SLA Status</h3>
              <div class="flex items-center gap-3">
                <div :class="slaDotStyle(ticket.sla_status)" class="w-2.5 h-2.5 rounded-full"></div>
                <span class="text-lg text-gray-200">{{ ticket.sla_status }}</span>
              </div>
            </div>
            <div class="glass-card p-6 rounded-xl">
              <h3 class="text-gray-500 text-[10px] uppercase tracking-widest mb-4 font-bold">Your Assignee</h3>
              <span class="text-violet-400 font-medium text-sm block truncate">
                {{ ticket.assignee ? `${ticket.assignee.first_name} ${ticket.assignee.last_name}` : 'Waiting for Agent...' }}
              </span>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-gray-500 text-[10px] uppercase tracking-widest px-1">Original Request</h3>
            <div class="glass-card p-6 rounded-xl">
              <p class="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{{ ticket.description }}</p>
            </div>
          </div>

          <div class="glass-card rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <div class="p-4 bg-white/5 border-b border-white/5">
              <h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Post an Update</h3>
            </div>
            <div class="p-6 bg-[#161824]">
              <textarea v-model="replyText" rows="4" placeholder="Type your message here..."
                class="w-full bg-transparent border-none outline-none text-gray-300 placeholder-gray-600 resize-none text-sm focus:ring-0"></textarea>
              <div class="flex justify-end items-center mt-4">
                <button @click="submitComment" :disabled="commentLoading || !replyText.trim()"
                  class="bg-gradient-to-r from-[#6359a3] to-[#4b4382] px-8 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-30">
                  {{ commentLoading ? 'Sending...' : 'Send Message' }}
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-gray-500 text-[10px] uppercase tracking-widest px-1">
              Conversation ({{ visibleComments.length }})
            </h3>
            <div v-for="comment in visibleComments" :key="comment.id" 
              class="glass-card p-5 rounded-xl transition-all hover:bg-white/[0.04]">
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white bg-violet-500/20 border border-violet-500/30">
                    {{ getInitials(comment.user?.first_name, comment.user?.last_name) }}
                  </div>
                  <span class="text-sm font-semibold text-gray-200">
                    {{ comment.user?.first_name }} {{ comment.user?.last_name }}
                  </span>
                </div>
                <span class="text-[10px] text-gray-600 font-mono">{{ formatDate(comment.created_at) }}</span>
              </div>
              <p class="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap ml-11">{{ comment.comment_text || comment.content }}</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="glass-card p-6 rounded-xl border border-violet-500/10">
            <h3 class="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-6">Ticket Details</h3>
            <div class="space-y-4">
              <div>
                <p class="text-[10px] text-gray-500 uppercase mb-1">Created Date</p>
                <p class="text-sm text-gray-300 font-medium">{{ formatDate(ticket.created_at) }}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500 uppercase mb-1">Response Goal (SLA)</p>
                <p class="text-sm text-gray-300 font-medium">{{ formatSLA(ticket.sla_deadline) }}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500 uppercase mb-1">Organization</p>
                <p class="text-sm text-gray-300 font-medium">Org ID: {{ ticket.client_profile?.organization_id }}</p>
              </div>
            </div>
          </div>

          <div class="glass-card p-6 rounded-xl">
            <h3 class="text-gray-500 text-[10px] uppercase tracking-widest mb-6 font-bold">Recent Activity</h3>
            <div class="space-y-6 relative before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
              <div v-for="history in ticket.status_histories" :key="history.id" class="relative pl-6">
                <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-violet-600"></div>
                <p class="text-xs text-gray-400 leading-snug">
                  Status changed to <span class="text-violet-400 font-bold">{{ history.status?.name || history.new_status?.name }}</span>
                </p>
                <p class="text-[10px] text-gray-600 mt-1 font-mono uppercase">{{ formatDate(history.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { TicketService } from '@/services/TicketService'
import { CommentService } from '@/services/CommentService'
import { toast } from 'vue3-toastify'

const route = useRoute()
const ticketId = route.params.id

// Data State
const ticket = ref(null)
const loading = ref(true)
const error = ref(false)
const replyText = ref('')
const commentLoading = ref(false)
const showSuccessToast = ref(false)

// Fetch Logic
const fetchTicketData = async () => {
  loading.value = true
  try {
    const res = await TicketService.getById(ticketId)
    const raw = res.data?.data
    if (raw) {
      raw.sla_status = calculateSLA(raw.sla_deadline)
      ticket.value = raw
    }
  } catch (err) {
    error.value = true
    toast.error('Failed to load ticket details')
  } finally {
    loading.value = false
  }
}

// SLA Logic
const calculateSLA = (deadline) => {
  if (!deadline) return 'On Track'
  const now = new Date()
  const due = new Date(deadline)
  const diff = (due - now) / (1000 * 60 * 60)
  if (diff < 0) return 'Breached'
  if (diff <= 6) return 'Due Soon'
  return 'On Track'
}

// Security: Clients never see internal notes
const visibleComments = computed(() => {
  return (ticket.value?.comments || []).filter(c => !c.is_internal)
})

// Submission Logic
const submitComment = async () => {
  if (!replyText.value.trim()) return
  commentLoading.value = true
  try {
    const payload = {
      ticket_id: parseInt(ticketId),
      user_id: 1, // <-- Replace with current logged-in user's ID
      content: replyText.value,
      is_internal: 0 // Clients always post public
    }

    console.log('Payload to send:', payload) // optional debug
    const res = await CommentService.create(payload)
    
    // Update UI
    ticket.value.comments.unshift(res.data.data)
    replyText.value = ''
    showSuccessToast.value = true
    setTimeout(() => showSuccessToast.value = false, 3000)
  } catch (err) {
    console.error('Failed to send comment:', err)
    if (err.response) console.error('Server response:', err.response.data)
    toast.error('Failed to send reply')
  } finally {
    commentLoading.value = false
  }
}

// Visual Helpers
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---'
const formatSLA = (d) => d ? new Date(d).toLocaleString() : 'No Deadline Set'
const getInitials = (f, l) => `${f?.[0] || ''}${l?.[0] || ''}`.toUpperCase()

const statusBadgeStyle = (n) => {
  const map = {
    'In Progress': 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
    'Resolved': 'bg-teal-500/20 text-teal-400 border border-teal-500/20',
    'Open': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
  }
  return map[n] || 'bg-gray-500/20 text-gray-400'
}

const priorityDot = (n) => n === 'High' || n === 'Critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-emerald-500'
const slaDotStyle = (s) => s === 'Breached' ? 'bg-red-500' : s === 'Due Soon' ? 'bg-yellow-500' : 'bg-emerald-500'

onMounted(fetchTicketData)
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
}

.animate-fadein {
  animation: fadein 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes fadein {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.toast-enter-active, .toast-leave-active { transition: all 0.4s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-20px); }
</style>