<template>
  <div class="flex flex-col gap-3 relative">
    <div class="flex gap-3 group relative">
      <div v-if="isChild" class="absolute -left-6 top-[-12px] bottom-1/2 w-4 border-l-2 border-b-2 border-white/10 rounded-bl-xl"></div>
      
      <div class="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center text-[11px] font-black text-white shadow-lg z-10">
        {{ getUserInitials(comment.user?.first_name, comment.user?.last_name, comment.user_id) }}
      </div>

      <div class="flex-1 min-w-0">
        <div 
          :class="[
            comment.is_internal ? 'bg-amber-500/10 border-amber-500/20' : 'bg-[#1c1e2d] border-white/5',
            'rounded-2xl rounded-tl-none px-4 py-3 border inline-block max-w-[95%] shadow-xl hover:border-white/20 transition-all'
          ]"
        >
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-[12px] font-bold text-violet-300">
              {{ getUserName(comment.user?.first_name, comment.user?.last_name, comment.user_id) }}
            </span>
            <span class="w-1 h-1 rounded-full bg-white/20"></span>
            <span class="text-[10px] text-gray-500 font-medium">{{ formatDate(comment.created_at || comment.updated_at) }}</span>
            <span v-if="comment.is_internal" class="text-[8px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full uppercase font-black tracking-tighter ml-1">Internal</span>
          </div>
          <p class="text-[13px] text-gray-200 leading-relaxed break-words font-light">{{ comment.content }}</p>
        </div>

        <div class="flex gap-4 mt-1.5 ml-1">
          <button 
            @click="$emit('reply', comment)"
            class="text-[10px] font-black text-gray-500 hover:text-violet-400 transition-all uppercase tracking-widest flex items-center gap-1"
          >
            <span class="text-sm">↩</span> Reply
          </button>
        </div>
      </div>
    </div>

    <div v-if="comment.replies && comment.replies.length" class="ml-10 space-y-4 border-l-2 border-white/5 pl-2 mt-1">
      <CommentItem 
        v-for="reply in comment.replies" 
        :key="reply.id" 
        :comment="reply" 
        :is-child="true"
        @reply="$emit('reply', $event)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({ comment: Object, isChild: Boolean });
defineEmits(['reply']);

const getUserInitials = (firstName, lastName, userId) => {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (lastName) return lastName[0].toUpperCase();
  return userId ? `U${userId}` : '?';
};

const getUserName = (firstName, lastName, userId) => {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return `User #${userId || '?'}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  try {
    // Convert "YYYY-MM-DD HH:MM:SS" to ISO format if needed
    let date = new Date(dateString);
    if (isNaN(date.getTime()) && typeof dateString === 'string' && dateString.includes(' ')) {
      date = new Date(dateString.replace(' ', 'T'));
    }
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 0) return 'Just now'; // future date (timezone offset)
    if (diffSecs < 5) return 'Just now';
    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return 'Last week';
    if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return 'Last month';
    if (diffMonths < 12) return `${diffMonths} months ago`;
    const diffYears = Math.floor(diffDays / 365);
    if (diffYears === 1) return 'Last year';
    return `${diffYears} years ago`;
  } catch (e) {
    return 'Invalid date';
  }
};
</script>