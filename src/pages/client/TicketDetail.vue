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
      <button @click="fetchData" class="mt-4 text-violet-400 underline">Try Again</button>
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

      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-semibold" style="font-family: 'Syne', sans-serif;">{{ ticket.title }}</h1>
        <button 
          @click="showCommentsPanel = !showCommentsPanel"
          class="flex items-center gap-3 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 px-5 py-2.5 rounded-xl border border-violet-500/20 transition-all active:scale-95"
        >
          <span>💬</span>
          <span class="font-bold text-sm uppercase tracking-tighter">
            {{ showCommentsPanel ? 'Hide History' : 'Show History' }}
          </span>
        </button>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left column: details & comment form -->
        <div :class="showCommentsPanel ? 'lg:col-span-7' : 'lg:col-span-8'" class="space-y-8">
          
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

          <!-- Comment Form -->
          <div class="glass-card rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <div class="p-4 bg-white/5 border-b border-white/5">
              <h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Post an Update</h3>
            </div>
            <div class="p-6 bg-[#161824]">
              <textarea v-model="newCommentText" rows="4" placeholder="Type your message here..."
                class="w-full bg-transparent border-none outline-none text-gray-300 placeholder-gray-600 resize-none text-sm focus:ring-0"></textarea>
              <div class="flex justify-end items-center mt-4">
                <button @click="submitComment" :disabled="submitting || !newCommentText.trim()"
                  class="bg-gradient-to-r from-[#6359a3] to-[#4b4382] px-8 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-30">
                  {{ submitting ? 'Sending...' : 'Send Message' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Comments Thread (only when visible) -->
        <div :class="showCommentsPanel ? 'lg:col-span-5' : 'lg:col-span-4'" class="space-y-6">
          
          <div v-if="showCommentsPanel" class="glass-card p-6 rounded-2xl border border-violet-500/10 h-[650px] flex flex-col">
            <h3 class="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-6">Conversation Thread</h3>
            <div class="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              <CommentItem 
                v-for="comment in threadedComments" 
                :key="comment.id" 
                :comment="comment" 
                :is-child="false"
                @reply="openReplyModal"
              />
              <div v-if="!threadedComments.length" class="text-center text-gray-500 text-sm py-10">No comments yet.</div>
            </div>
          </div>

          <!-- Ticket Details Sidebar -->
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

    <!-- Reply Modal -->
<div v-if="replyingTo" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
  <div class="glass-card w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl">
    <h2 class="text-xl font-bold text-violet-400 mb-2">Reply to Comment</h2>
    <p class="text-xs text-gray-500 mb-6 italic">"{{ replyingTo.content }}"</p>
    <textarea v-model="replyText" rows="5" class="w-full bg-[#0b0c14] border border-white/10 rounded-xl p-4 text-sm focus:border-violet-500 outline-none mb-6" placeholder="Type your reply..."></textarea>
    <div class="flex gap-4">
      <button @click="replyingTo = null" class="flex-1 py-3 text-gray-400 font-bold">Cancel</button>
      <button 
        @click="submitReply" 
        :disabled="submitting || !replyText.trim()" 
        class="flex-1 bg-violet-600 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ submitting ? 'Posting...' : 'Post Reply' }}
      </button>
    </div>
  </div>
</div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { TicketService } from '@/services/TicketService';
import { CommentService } from '@/services/CommentService';
import CommentItem from '@/pages/agent/CommentItem.vue';
import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const ticketId = route.params.id;
const auth = useAuthStore();

const ticket = ref(null);
const loading = ref(true);
const error = ref(false);
const showCommentsPanel = ref(true);
const newCommentText = ref('');
const replyText = ref('');
const replyingTo = ref(null);
const submitting = ref(false);
const showSuccessToast = ref(false);

// Fetch all comments (all pages)
const fetchAllComments = async () => {
  let allComments = [];
  let page = 1;
  let lastPage = 1;
  try {
    do {
      const res = await CommentService.getAll({ page, per_page: 100 });
      let pageData = res.data?.data?.comments?.data || res.data?.data || [];
      if (pageData.length === 0) break;
      allComments = [...allComments, ...pageData];
      lastPage = res.data?.data?.comments?.last_page || res.data?.data?.last_page || page;
      page++;
    } while (page <= lastPage);
  } catch (err) {
    console.error('Failed to fetch comments:', err);
  }
  return allComments;
};

const threadedComments = computed(() => {
  const allComments = (ticket.value?.comments || []).filter(c => !c.is_internal);
  const map = {};
  const roots = [];
  allComments.forEach(c => { map[c.id] = { ...c, replies: [] }; });
  allComments.forEach(c => {
    if (c.parent_id && map[c.parent_id]) map[c.parent_id].replies.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const fetchData = async () => {
  loading.value = true;
  try {
    const [ticketRes] = await Promise.all([TicketService.getById(ticketId)]);
    const rawTicket = ticketRes.data.data;
    rawTicket.sla_status = calculateSLA(rawTicket.sla_deadline);
    ticket.value = rawTicket;

    const allComments = await fetchAllComments();
    const filtered = allComments.filter(c => c.ticket_id === parseInt(ticketId) && !c.is_internal);
    ticket.value.comments = filtered;
  } catch (err) {
    console.error(err);
    error.value = true;
    toast.error('Failed to load ticket details');
  } finally {
    loading.value = false;
  }
};

// SLA calculation
const calculateSLA = (deadline) => {
  if (!deadline) return 'On Track';
  const now = new Date();
  const due = new Date(deadline);
  const diff = (due - now) / (1000 * 60 * 60);
  if (diff < 0) return 'Breached';
  if (diff <= 6) return 'Due Soon';
  return 'On Track';
};

// ---------- Submit new comment (root level) ----------
const submitComment = async () => {
  if (!newCommentText.value.trim()) return;
  submitting.value = true;
  try {
    const payload = {
      ticket_id: parseInt(ticketId),
      user_id: auth.user?.id || 1, // use logged-in user ID
      content: newCommentText.value,
      is_internal: 0, // clients only post public
      parent_id: null
    };
    const res = await CommentService.create(payload);
    // Append new comment to flat list
    ticket.value.comments.push(res.data.data);
    newCommentText.value = '';
    triggerToast();
  } catch (err) {
    console.error(err);
    toast.error('Failed to send message');
  } finally {
    submitting.value = false;
  }
};

// ---------- Submit reply (nested) ----------

const submitReply = async () => {
  if (!replyText.value.trim() || !replyingTo.value) return;
  submitting.value = true;
  try {
    const res = await CommentService.create({
      ticket_id: parseInt(ticketId),
      parent_id: replyingTo.value.id,
      user_id: auth.user?.id || 1,
      content: replyText.value,
      is_internal: 0
    });
    ticket.value.comments.push(res.data.data);
    replyText.value = '';
    replyingTo.value = null;
    triggerToast();
  } catch (err) {
    console.error(err);
    toast.error('Failed to post reply');
  } finally {
    submitting.value = false;
  }
};

const openReplyModal = (comment) => {
  replyingTo.value = comment;
};

const triggerToast = () => {
  showSuccessToast.value = true;
  setTimeout(() => (showSuccessToast.value = false), 3000);
};

// ---------- UI Helpers ----------
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---';
const formatSLA = (d) => d ? new Date(d).toLocaleString() : 'No Deadline Set';
const statusBadgeStyle = (n) => {
  const map = {
    'In Progress': 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
    'Resolved': 'bg-teal-500/20 text-teal-400 border border-teal-500/20',
    'Open': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
  };
  return map[n] || 'bg-gray-500/20 text-gray-400';
};
const priorityDot = (n) => n === 'High' || n === 'Critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-emerald-500';
const slaDotStyle = (s) => s === 'Breached' ? 'bg-red-500' : s === 'Due Soon' ? 'bg-yellow-500' : 'bg-emerald-500';

onMounted(fetchData);
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 10px; }
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