<template>
  <div class="flex flex-col gap-3 relative">
    <div class="flex gap-3 group relative">
      <div v-if="isChild" class="absolute -left-6 top-[-12px] bottom-1/2 w-4 border-l-2 border-b-2 border-white/10 rounded-bl-xl"></div>
      
      <div class="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center text-[11px] font-black text-white shadow-lg z-10">
        {{ comment.user_id }}
      </div>

      <div class="flex-1 min-w-0">
        <div 
          :class="[
            comment.is_internal ? 'bg-amber-500/10 border-amber-500/20' : 'bg-[#1c1e2d] border-white/5',
            'rounded-2xl rounded-tl-none px-4 py-3 border inline-block max-w-[95%] shadow-xl hover:border-white/20 transition-all'
          ]"
        >
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-[12px] font-bold text-violet-300">User #{{ comment.user_id }}</span>
            <span class="w-1 h-1 rounded-full bg-white/20"></span>
            <span class="text-[10px] text-gray-500 font-medium">{{ formatDate(comment.created_at) }}</span>
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
const formatDate = (d) => {
  if(!d) return '';
  const date = new Date(d);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>