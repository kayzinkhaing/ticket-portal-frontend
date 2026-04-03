<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-3 group relative">
      <div v-if="isChild" class="absolute -left-5 top-0 bottom-0 w-px bg-white/10"></div>
      
      <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#1c1e2d] border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-400">
        {{ comment.user_id }}
      </div>

      <div class="flex-1 min-w-0">
        <div 
          :class="[
            comment.is_internal ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-white/5 border-white/10',
            'rounded-2xl rounded-tl-none px-4 py-2 border inline-block max-w-full shadow-sm'
          ]"
        >
          <div class="flex items-center gap-3 mb-1">
            <span class="text-[11px] font-bold text-violet-400">User #{{ comment.user_id }}</span>
            <span class="text-[9px] text-gray-500 font-mono">{{ formatDate(comment.created_at) }}</span>
            <span v-if="comment.is_internal" class="text-[8px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded uppercase font-bold">Internal</span>
          </div>
          <p class="text-sm text-gray-300 leading-relaxed break-words">{{ comment.content }}</p>
        </div>

        <div class="flex gap-4 mt-1 ml-2">
          <button 
            @click="$emit('reply', comment)"
            class="text-[10px] font-bold text-gray-500 hover:text-violet-400 transition-colors uppercase tracking-wider"
          >
            Reply
          </button>
        </div>
      </div>
    </div>

    <div v-if="comment.replies && comment.replies.length" class="ml-10 mt-2 space-y-4 border-l border-white/5 pl-4">
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
const formatDate = (d) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
</script>