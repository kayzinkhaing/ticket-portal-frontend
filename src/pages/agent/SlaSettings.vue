<template>
  <div class="animate-fadein p-8 text-white max-w-6xl mx-auto">
    <!-- HEADER -->
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight">SLA Settings</h1>
      <p class="text-gray-400 mt-2 max-w-xl text-sm">
        Define your service level agreements to ensure timely resolutions and maintain high-end support.
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      <!-- SLA TARGETS -->
      <section class="lg:col-span-2 glass-card rounded-3xl p-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-xl font-medium">Resolution Targets</h2>
            <p class="text-gray-400 text-sm mt-1">
              Set maximum time limits for ticket resolution based on priority.
            </p>
          </div>

          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <!-- ✅ LOADING -->
        <div v-if="loading" class="text-gray-400">Loading priorities...</div>

        <!-- ❌ ERROR -->
        <div v-if="error" class="text-red-400">{{ error }}</div>

        <!-- ✅ DATA -->
        <div v-if="!loading && targets.length" class="space-y-4">
          <SlaTargetRow 
            v-for="target in targets" 
            :key="target.id" 
            v-bind="target"
          />
        </div>

        <!-- ❗ EMPTY -->
        <div v-if="!loading && !targets.length" class="text-gray-500">
          No SLA data found.
        </div>
      </section>

      <!-- RIGHT SIDE -->
      <aside class="space-y-8">
        <div class="glass-card rounded-3xl p-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="p-1.5 bg-violet-500/10 rounded-lg text-violet-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                   viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 class="text-lg font-medium text-gray-200">Breach Alerts</h2>
          </div>

          <div class="space-y-6">
            <SlaToggle 
              label="Internal Slack Alert" 
              description="Send notification to #support-ops when ticket is at 80% threshold."
              v-model="settings.slackAlert"
            />
            <SlaToggle 
              label="Manager Escalation" 
              description="Notify lead agent via email if target is exceeded."
              v-model="settings.managerEscalation"
            />
            <SlaToggle 
              label="Client Delay Notice" 
              description="Automatically inform client of high-traffic delays."
              v-model="settings.clientNotice"
              disabled
            />
          </div>

          <button
            class="w-full mt-8 py-3 bg-violet-600/10 text-violet-400 text-[10px]
                   font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-violet-600/20
                   transition-all border border-violet-500/20"
          >
            Add Custom Rule
          </button>
        </div>

        <SlaSystemStatus :ticket-count="4209" :load="92" :uptime="99.9" />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import SlaTargetRow from '@/components/SlaTargetRow.vue';
import SlaToggle from '@/components/SlaToggle.vue';
import SlaSystemStatus from '@/components/SlaSystemStatus.vue';
import { PriorityService } from '@/services/PriorityService';

// ✅ STATE
const loading = ref(false);
const error = ref(null);
const targets = ref([]);

// ✅ SETTINGS
const settings = reactive({
  slackAlert: true,
  managerEscalation: true,
  clientNotice: false
});

// 🎨 COLOR MAPPING
const getColor = (name) => {
  switch (name.toLowerCase()) {
    case 'critical':
      return { bg: 'bg-[#ff8a8a]', text: 'text-[#ff8a8a]' };
    case 'high':
      return { bg: 'bg-[#8a94ff]', text: 'text-[#8a94ff]' };
    case 'medium':
      return { bg: 'bg-[#5eead4]', text: 'text-[#5eead4]' };
    case 'low':
      return { bg: 'bg-gray-500', text: 'text-gray-500' };
    default:
      return { bg: 'bg-gray-400', text: 'text-gray-400' };
  }
};

// 📡 FETCH DATA
const fetchPriorities = async () => {
  loading.value = true;
  error.value = null;

  try {
    const res = await PriorityService.getAll();

    // 🔥 IMPORTANT PATH
    const list = res.data.data.ticketpriorities.data;

    targets.value = list.map(item => {
      const colors = getColor(item.name);

      return {
        id: item.id,
        priority: item.name,
        time: item.sla_hours,
        colorClass: colors.bg,
        textColor: colors.text,
        notification: item.sla_hours <= 4
          ? 'Instant Alert'
          : `Alert at ${Math.floor(item.sla_hours / 2)} hrs`
      };
    });

  } catch (err) {
    console.error(err);
    error.value = 'Failed to load SLA data';
  } finally {
    loading.value = false;
  }
};

// 🚀 INIT
onMounted(() => {
  fetchPriorities();
});
</script>

<style scoped>
.glass-card {
  background: rgb(30, 33, 48);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

@keyframes fadein { 
  from { opacity: 0; transform: translateY(10px); } 
  to { opacity: 1; transform: translateY(0); } 
}

.animate-fadein {
  animation: fadein 0.6s ease-out;
}
</style>