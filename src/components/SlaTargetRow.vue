<template>
  <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
    <div class="flex items-center gap-4">
      <div :class="['w-1.5 h-12 rounded-full transition-shadow group-hover:shadow-[0_0_8px] group-hover:shadow-current', colorClass]"></div>
      <div>
        <span :class="['text-[10px] font-bold uppercase tracking-widest', textColor]">{{ priority }}</span>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-xl font-semibold">{{ time }}</span>
          <span class="text-xs text-gray-500 uppercase tracking-tighter">Hours</span>
        </div>
      </div>
    </div>
    <div class="text-right">
      <div class="text-[10px] text-gray-500 font-mono tracking-tighter">{{ id }}</div>
      <div class="text-sm text-gray-300 mt-1">{{ notification }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  priority: String,
  time: [String, Number],
  colorClass: String,
  textColor: String,
  notification: String
});
</script>