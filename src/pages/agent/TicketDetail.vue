<template>
  <main class="flex-1 p-8 bg-[#0b0c14] min-h-screen text-white font-sans relative">
    <Transition name="toast">
      <div v-if="showSuccessToast" class="fixed top-10 right-10 z-50 flex items-center gap-3 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg border border-emerald-400/50">
        <span>✅</span>
        <span class="font-medium text-sm">Action successful!</span>
      </div>
    </Transition>

    <div v-if="loading" class="text-center py-20 text-lg font-medium text-violet-400">Loading ticket...</div>
    <div v-else-if="error" class="text-red-500 text-center py-20">Failed to load ticket.</div>

    <div v-else class="max-w-[1400px] mx-auto">
      <!-- Header / Status / ID / Back -->
      <div class="flex justify-between items-start mb-6">
        <div class="flex gap-4">
          <span :class="statusBadgeStyle(ticket.status?.name)" class="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            {{ ticket.status?.name || 'Open' }}
          </span>
          <span class="bg-[#3d1d1d] text-red-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            #{{ ticket.id }}
          </span>
        </div>
        <button @click="$router.back()" class="text-gray-500 hover:text-white transition text-sm">✕ Close</button>
      </div>

      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-semibold">{{ ticket.title }}</h1>
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

      <p class="text-gray-400 max-w-3xl leading-relaxed mb-8">{{ ticket.description }}</p>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left column -->
        <div :class="showCommentsPanel ? 'lg:col-span-7' : 'lg:col-span-8'" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="glass-card p-6 rounded-xl">
              <h3 class="text-gray-500 text-[10px] uppercase tracking-widest mb-4">Priority</h3>
              <div class="flex items-center gap-2">
                <div :class="priorityDot(ticket.priority?.name)" class="w-2.5 h-2.5 rounded-full"></div>
                <span class="text-lg text-gray-200">{{ ticket.priority?.name || '---' }}</span>
              </div>
            </div>
            <div class="glass-card p-6 rounded-xl">
              <h3 class="text-gray-500 text-[10px] uppercase tracking-widest mb-4">SLA Deadline</h3>
              <div class="text-sm text-gray-200">{{ formatDate(ticket.sla_deadline) }}</div>
            </div>
            <div class="glass-card p-6 rounded-xl">
              <h3 class="text-gray-500 text-[10px] uppercase tracking-widest mb-4">Client</h3>
              <span class="text-violet-400 font-medium text-sm block truncate">
                {{ ticket.client_profile?.user?.first_name }} {{ ticket.client_profile?.user?.last_name }}
              </span>
            </div>
          </div>

          <!-- Comment Form -->
          <div class="glass-card rounded-xl overflow-hidden border border-white/10">
            <div class="flex border-b border-white/5 bg-white/5">
              <button @click="activeTab = 'public'" :class="activeTab === 'public' ? 'text-white border-b-2 border-violet-500' : 'text-gray-500'" class="px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition">Public Reply</button>
              <button @click="activeTab = 'internal'" :class="activeTab === 'internal' ? 'text-white border-b-2 border-violet-500 bg-yellow-500/5' : 'text-gray-500'" class="px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition">Internal Note</button>
            </div>
            <div class="p-6 bg-[#161824]">
              <textarea v-model="newCommentText" rows="4" :placeholder="activeTab === 'public' ? 'Reply to client...' : 'Note for internal team...'" class="w-full bg-transparent border-none outline-none text-gray-300 text-sm focus:ring-0"></textarea>
              <div class="flex justify-end mt-4">
                <button @click="submitComment(null)" :disabled="submitting || !newCommentText.trim()" class="bg-violet-600 px-8 py-2.5 rounded-lg font-bold hover:bg-violet-500 transition-all disabled:opacity-30">
                  {{ submitting ? 'Sending...' : 'Send Reply' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column -->
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

          <div class="glass-card p-6 rounded-xl border border-violet-500/10">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Assignee</h3>
              <button @click="isEditingAssignee = !isEditingAssignee" class="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-1 rounded">
                {{ isEditingAssignee ? 'Cancel' : 'Reassign' }}
              </button>
            </div>
            <div v-if="!isEditingAssignee" class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-[#1c1e2d] border border-white/5 flex items-center justify-center text-violet-400 font-bold text-xl">
                {{ ticket.assignee?.first_name ? ticket.assignee.first_name[0] : '?' }}
              </div>
              <div>
                <p class="font-semibold text-gray-100 text-sm">{{ ticket.assignee?.first_name || 'Unassigned' }}</p>
                <p class="text-[10px] text-gray-500 italic mt-0.5">Managed by {{ ticket.assigned_by?.first_name || 'System' }}</p>
              </div>
            </div>
            <div v-else class="space-y-4">
              <select v-model="selectedAgentId" class="w-full bg-[#0b0c14] border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:border-violet-500 outline-none">
                <option :value="null">Select Agent...</option>
                <option v-for="agent in agents" :key="agent.id" :value="agent.id">{{ agent.first_name }} {{ agent.last_name }}</option>
              </select>
              <div class="flex gap-2">
                <button @click="confirmReassign" :disabled="!selectedAgentId || assigning" class="flex-1 bg-violet-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-violet-500 disabled:opacity-30">
                  {{ assigning ? 'Updating...' : 'Apply' }}
                </button>
                <button @click="selfAssign" class="px-3 bg-white/5 text-gray-400 rounded-lg text-xs hover:bg-white/10 transition">Me</button>
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
          <button @click="submitComment(replyingTo.id)" :disabled="submitting || !replyText.trim()" class="flex-1 bg-violet-600 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed">
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
import { TicketService } from '../../services/TicketService.js';
import { CommentService } from '../../services/CommentService.js';
import CommentItem from './CommentItem.vue';

const route = useRoute();
const ticketId = route.params.id;

const ticket = ref({ comments: [], status: {}, priority: {}, client_profile: { user: {} }, assignee: {} });
const agents = ref([]);
const loading = ref(true);
const error = ref(false);
const showCommentsPanel = ref(true);
const activeTab = ref('public');
const newCommentText = ref('');
const replyText = ref('');
const replyingTo = ref(null);
const submitting = ref(false);
const isEditingAssignee = ref(false);
const selectedAgentId = ref(null);
const assigning = ref(false);
const showSuccessToast = ref(false);

// -------------------------------
// Helper: fetch all comments (all pages)
// -------------------------------
const fetchAllComments = async () => {
  let allComments = [];
  let page = 1;
  let lastPage = 1;
  try {
    do {
      const res = await CommentService.getAll({ page, per_page: 100 });
      // Extract page data – adjust path as needed
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

// -------------------------------
// Build threaded comments tree
// -------------------------------
const threadedComments = computed(() => {
  const allComments = Array.isArray(ticket.value.comments) ? [...ticket.value.comments] : [];
  const map = {};
  const roots = [];

  allComments.forEach(c => {
    map[c.id] = { ...c, replies: [] };
  });

  allComments.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

// -------------------------------
// Submit comment (new or reply)
// -------------------------------
const submitComment = async (parentId = null) => {
  const content = parentId ? replyText.value : newCommentText.value;
  if (!content.trim()) return;

  try {
    submitting.value = true;
    const res = await CommentService.create({
      ticket_id: parseInt(ticketId),
      parent_id: parentId,
      user_id: 1, // TODO: get from auth store
      content: content,
      is_internal: activeTab.value === 'internal' ? 1 : 0,
    });

    const newComment = res.data?.data;
    if (newComment) {
      ticket.value.comments.push(newComment);
    }

    newCommentText.value = '';
    replyText.value = '';
    replyingTo.value = null;
    triggerToast();
  } catch (err) {
    console.error('Comment failed:', err);
  } finally {
    submitting.value = false;
  }
};

// -------------------------------
// Fetch ticket, agents, and all comments (filtered by ticket_id)
// -------------------------------
const fetchData = async () => {
  try {
    loading.value = true;
    const [ticketRes, agentRes] = await Promise.all([
      TicketService.getById(ticketId),
      TicketService.getAgents(),
    ]);
    ticket.value = ticketRes.data.data;
    agents.value = agentRes.data?.data || agentRes.data || [];
    selectedAgentId.value = ticket.value.assigned_to;

    // Fetch all comments (paginated) and filter client-side
    const allComments = await fetchAllComments();
    const filtered = allComments.filter(c => c.ticket_id === parseInt(ticketId));
    ticket.value.comments = filtered;
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// -------------------------------
// Reassign logic
// -------------------------------
const confirmReassign = async () => {
  if (!selectedAgentId.value) return;
  try {
    assigning.value = true;
    const res = await TicketService.update(ticketId, { assigned_to: selectedAgentId.value });
    ticket.value.assignee = agents.value.find(a => a.id === res.data.data.assigned_to);
    isEditingAssignee.value = false;
    triggerToast();
  } catch (err) {
    alert('Assignment failed');
  } finally {
    assigning.value = false;
  }
};

const selfAssign = () => {
  selectedAgentId.value = 1; // replace with actual logged-in agent ID
  confirmReassign();
};

// -------------------------------
// Helpers
// -------------------------------
const triggerToast = () => {
  showSuccessToast.value = true;
  setTimeout(() => (showSuccessToast.value = false), 3000);
};

const openReplyModal = (comment) => {
  replyingTo.value = comment;
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '---';
const statusBadgeStyle = (n) => (n === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400');
const priorityDot = (n) => (n === 'High' ? 'bg-orange-500 shadow-md' : 'bg-emerald-500');

onMounted(fetchData);
</script>

<style scoped>
.glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 10px; }
.toast-enter-active, .toast-leave-active { transition: all 0.4s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-20px); }
</style>