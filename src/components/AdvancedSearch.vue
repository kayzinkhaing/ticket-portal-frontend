<template>
  <div class="flex flex-wrap items-center gap-4 py-2 px-4 bg-[#1f2233]/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm mb-4">
    
    <div class="relative flex-grow max-w-md">
      <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        v-model="filters.keyword"
        type="text"
        placeholder="Quick search..."
        class="bg-transparent border-none text-sm text-slate-200 placeholder-slate-500 focus:ring-0 w-full pl-9"
      />
    </div>

    <div class="hidden md:block w-px h-6 bg-slate-700/50"></div>

    <div class="flex items-center gap-6">
      <div class="flex items-center gap-1.5">
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-1">Status</span>
        <button 
          v-for="s in statuses" :key="s.id"
          @click="toggleStatus(s.id)"
          :class="[
            'px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border',
            filters.statusId.includes(s.id) 
              ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
              : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
          ]"
        >
          {{ s.name }}
        </button>
      </div>

      <div class="flex items-center gap-1.5">
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-1">Priority</span>
        <button 
          v-for="p in priorities" :key="p.id"
          @click="togglePriority(p.id)"
          :class="[
            'px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border',
            filters.priorityId.includes(p.id) 
              ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20' 
              : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
          ]"
        >
          {{ p.name }}
        </button>
      </div>
    </div>

    <div class="ml-auto flex items-center gap-3">
      <select v-model="filters.organizationId" class="bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-1.5 focus:border-indigo-500 outline-none">
        <option value="">All Orgs</option>
        <option v-for="o in organizations" :key="o.id" :value="o.id">{{ o.name }}</option>
      </select>

      <button 
        @click="applyFilters"
        class="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-xl shadow-indigo-500/10"
      >
        Filter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { StatusService } from "@/services/StatusService";
import { PriorityService } from "@/services/PriorityService";
import { OrganizationService } from "@/services/OrganizationService";

const emit = defineEmits(["update:filters"]);

const filters = ref({
  keyword: "",
  statusId: [],
  priorityId: [],
  organizationId: "",
  dateFrom: "", // Kept in logic but hidden for cleaner UI
  dateTo: "",
});

const statuses = ref([]);
const priorities = ref([]);
const organizations = ref([]);

// Simple logic to toggle items in array (keeps your current multi-select logic)
const toggleStatus = (id) => {
  const index = filters.value.statusId.indexOf(id);
  if (index === -1) filters.value.statusId.push(id);
  else filters.value.statusId.splice(index, 1);
};

const togglePriority = (id) => {
  const index = filters.value.priorityId.indexOf(id);
  if (index === -1) filters.value.priorityId.push(id);
  else filters.value.priorityId.splice(index, 1);
};

onMounted(async () => {
  try {
    statuses.value = (await StatusService.getAll()) || [];
    priorities.value = (await PriorityService.getAll()) || [];
    organizations.value = (await OrganizationService.getAll()) || [];
  } catch (err) { console.error(err); }
});

const applyFilters = () => {
  const payload = {
    organization_id: filters.value.organizationId || null,
    status_id: [...filters.value.statusId],      // <-- unwrap the reactive array
    priority_id: [...filters.value.priorityId],  // <-- unwrap the reactive array
    keyword: filters.value.keyword || "",
    date_from: filters.value.dateFrom || null,
    date_to: filters.value.dateTo || null,
  };

  console.log("Filters being sent:", JSON.stringify(payload, null, 2)); 
  // Use JSON.stringify to see exactly what backend expects
  emit("update:filters", payload);
};
</script>