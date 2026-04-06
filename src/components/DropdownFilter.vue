<template>
  <div ref="dropdownRef" class="relative">
    <button
      @click="open = !open"
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-white/5"
    >
      {{ label }}
      <span v-if="localSelected.length" class="text-indigo-400 font-bold">
        ({{ localSelected.length }})
      </span>
    </button>

    <div
      v-if="open"
      class="absolute z-50 mt-2 w-48 bg-[#1c1f2e] border border-white/10 rounded-xl p-2 shadow-xl"
    >
      <label
        v-for="item in options"
        :key="item.id"
        class="flex items-center gap-3 px-3 py-2 hover:bg-white/5 cursor-pointer rounded-md"
      >
        <input type="checkbox" :value="item.id" v-model="localSelected" />
        <span class="text-xs text-slate-300">{{ item.name }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  label: String,
  options: Array,
  selected: Array,
});

const emit = defineEmits(["update:selected"]);

const open = ref(false);
const localSelected = ref([...props.selected]);
const dropdownRef = ref(null);

// Sync parent → local
watch(
  () => props.selected,
  (val) => {
    localSelected.value = [...val];
  },
  { deep: true }
);

// Sync local → parent
watch(localSelected, (val) => {
  emit("update:selected", val);
});

// Click outside to close
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>