<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#020617] flex flex-col font-[Inter,system-ui]"
  >
    <!-- Header -->
    <div class="w-full flex justify-start px-8 py-6 border-b border-white/5">
      <span class="text-[#6c8ef5] font-semibold text-lg tracking-wide">
        SupportDesk
      </span>
    </div>

    <div class="flex flex-1">
      <!-- Left info panel -->
      <div
        class="hidden lg:flex w-1/2 relative items-center justify-center px-24 overflow-hidden"
      >
        <div
          class="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-[#6c8ef5]/20 blur-[150px] rounded-full"
        ></div>
        <div
          class="absolute bottom-[-100px] right-[50px] w-[400px] h-[400px] bg-purple-500/20 blur-[150px] rounded-full"
        ></div>

        <div class="relative z-10 max-w-lg">
          <h1 class="text-5xl font-bold text-white leading-tight mb-6">
            Build smarter <br />
            <span class="text-[#6c8ef5]">support experiences</span>
          </h1>
          <p class="text-gray-400">
            Manage tickets, streamline communication, and deliver faster
            resolutions.
          </p>
        </div>
      </div>

      <!-- Form panel -->
      <div class="flex flex-1 justify-center px-6 lg:px-20 pt-16 lg:pt-10">
        <div class="w-full max-w-md">
          <h2 class="text-white text-3xl font-semibold mb-2">
            Create your account
          </h2>
          <p class="text-gray-400 mb-8">Start managing your support system</p>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Name fields -->
            <div class="grid grid-cols-3 gap-4">
              <div class="flex flex-col">
                <input
                  v-model="form.first"
                  placeholder="First name"
                  :class="[
                    'w-full bg-white/5 border px-4 py-3 rounded-lg text-white placeholder:text-gray-500 focus:outline-none transition-all',
                    errors.first ? 'border-red-500' : 'border-white/10 focus:ring-2 focus:ring-[#6c8ef5]/50 focus:border-[#6c8ef5]'
                  ]"
                />
                <span v-if="errors.first" class="text-red-500 text-xs mt-1">{{ errors.first }}</span>
              </div>

              <div class="flex flex-col">
                <input
                  v-model="form.middle"
                  placeholder="Middle name"
                  class="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c8ef5]/50 focus:border-[#6c8ef5] transition-all"
                />
              </div>

              <div class="flex flex-col">
                <input
                  v-model="form.last"
                  placeholder="Last name"
                  :class="[
                    'w-full bg-white/5 border px-4 py-3 rounded-lg text-white placeholder:text-gray-500 focus:outline-none transition-all',
                    errors.last ? 'border-red-500' : 'border-white/10 focus:ring-2 focus:ring-[#6c8ef5]/50 focus:border-[#6c8ef5]'
                  ]"
                />
                <span v-if="errors.last" class="text-red-500 text-xs mt-1">{{ errors.last }}</span>
              </div>
            </div>

            <!-- Email -->
            <div class="flex flex-col">
              <input
                v-model="form.email"
                type="email"
                placeholder="Email address"
                :class="[
                  'w-full bg-white/5 border px-4 py-3 rounded-lg text-white placeholder:text-gray-500 focus:outline-none transition-all',
                  errors.email ? 'border-red-500' : 'border-white/10 focus:ring-2 focus:ring-[#6c8ef5]/50 focus:border-[#6c8ef5]'
                ]"
              />
              <span v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</span>
            </div>

            <!-- Role selection -->
            <div>
              <label class="text-gray-300 mb-2 block font-semibold text-sm">Select Role</label>
              <div class="flex gap-4">
                <button
                  type="button"
                  @click="selectRole('agent')"
                  :class="roleButtonClass('agent')"
                  class="w-1/2 py-3 rounded-lg border text-center font-medium transition-all duration-200 hover:bg-[#6c8ef5]/80"
                >
                  Agent
                </button>
                <button
                  type="button"
                  @click="selectRole('client')"
                  :class="roleButtonClass('client')"
                  class="w-1/2 py-3 rounded-lg border text-center font-medium transition-all duration-200 hover:bg-[#6c8ef5]/80"
                >
                  Client
                </button>
              </div>
              <span v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</span>
            </div>

            <!-- Organization -->
            <div v-if="form.role === 'client'" class="space-y-2 flex flex-col">
              <label class="text-gray-300 block font-semibold text-sm">Organization</label>
              <select
                v-model="form.organization_id"
                :class="[
                  'w-full bg-[#161e2e] border px-4 py-3 rounded-lg focus:outline-none transition-all cursor-pointer',
                  errors.organization_id ? 'border-red-500' : 'border-white/10 focus:ring-2 focus:ring-[#6c8ef5]/50 focus:border-[#6c8ef5]',
                  !form.organization_id ? 'text-gray-500' : 'text-white'
                ]"
              >
                <option value="" disabled selected>Choose your organization...</option>
                <option
                  v-for="org in organizations"
                  :key="org.id"
                  :value="org.id"
                  class="bg-[#1e293b] text-white py-2"
                >
                  {{ org.name }}
                </option>
              </select>
              <span v-if="errors.organization_id" class="text-red-500 text-xs mt-1">{{ errors.organization_id }}</span>
            </div>

            <!-- Password -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col">
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="Password"
                  :class="[
                    'w-full bg-white/5 border px-4 py-3 rounded-lg text-white placeholder:text-gray-500 focus:outline-none transition-all',
                    errors.password ? 'border-red-500' : 'border-white/10 focus:ring-2 focus:ring-[#6c8ef5]/50 focus:border-[#6c8ef5]'
                  ]"
                />
                <span v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</span>
              </div>

              <div class="flex flex-col">
                <input
                  v-model="form.confirm"
                  type="password"
                  placeholder="Confirm"
                  :class="[
                    'w-full bg-white/5 border px-4 py-3 rounded-lg text-white placeholder:text-gray-500 focus:outline-none transition-all',
                    errors.confirm ? 'border-red-500' : 'border-white/10 focus:ring-2 focus:ring-[#6c8ef5]/50 focus:border-[#6c8ef5]'
                  ]"
                />
                <span v-if="errors.confirm" class="text-red-500 text-xs mt-1">{{ errors.confirm }}</span>
              </div>
            </div>

            <!-- Terms -->
            <label class="flex items-center gap-3 text-sm text-gray-400 cursor-pointer group">
              <input
                type="checkbox"
                v-model="form.terms"
                class="w-4 h-4 rounded border-white/10 bg-white/5 text-[#6c8ef5] focus:ring-[#6c8ef5] focus:ring-offset-0 transition-all accent-[#6c8ef5]"
              />
              <span class="group-hover:text-gray-300 transition-colors">I agree to terms</span>
            </label>
            <span v-if="errors.terms" class="text-red-500 text-xs mt-1">{{ errors.terms }}</span>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 bg-[#6c8ef5] hover:bg-[#5a7de0] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold shadow-lg shadow-[#6c8ef5]/20 transform active:scale-[0.98] transition-all"
            >
              <span v-if="!isLoading" class="flex items-center justify-center gap-2">
                Create Account
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            </button>
          </form>

          <p class="text-gray-500 text-sm mt-8 text-center">
            Already have an account?
            <router-link to="/login" class="text-[#6c8ef5] hover:underline font-medium ml-1">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "../services/authService";
import { OrganizationService } from "../services/OrganizationService";

const router = useRouter();
const isLoading = ref(false);
const organizations = ref([]);

const form = reactive({
  first: "",
  middle: "",
  last: "",
  email: "",
  password: "",
  confirm: "",
  role: "client",
  organization_id: "",
  terms: false,
});

// Error messages
const errors = reactive({
  first: null,
  last: null,
  email: null,
  password: null,
  confirm: null,
  role: null,
  organization_id: null,
  terms: null,
});

onMounted(async () => {
  try {
    const res = await OrganizationService.getAll();
    organizations.value = res.data.organizations || [];
  } catch (err) {
    console.error("Failed to load organizations:", err);
  }
});

function selectRole(role) {
  form.role = role;
  if (role === "agent") form.organization_id = null;
}

function roleButtonClass(role) {
  return form.role === role
    ? "bg-[#6c8ef5] text-white border-[#6c8ef5]"
    : "bg-white/5 text-gray-400 border-white/10";
}

// Validate
function validateForm() {
  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = null));

  let valid = true;
  if (!form.first) {
    errors.first = "First name is required";
    valid = false;
  }
  if (!form.last) {
    errors.last = "Last name is required";
    valid = false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = "Valid email is required";
    valid = false;
  }
  if (!form.password || form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    valid = false;
  }
  if (form.password !== form.confirm) {
    errors.confirm = "Passwords do not match";
    valid = false;
  }
  if (form.role === "client" && !form.organization_id) {
    errors.organization_id = "Please select your organization";
    valid = false;
  }
  if (!form.terms) {
    errors.terms = "You must agree to terms";
    valid = false;
  }
  return valid;
}

async function handleSubmit() {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    await AuthService.register({
      first_name: form.first,
      middle_name: form.middle,
      last_name: form.last,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirm,
      role: form.role,
      organization_id: form.role === "client" ? form.organization_id || null : null,
    });
    router.push({ path: "/verify-email", query: { email: form.email } });
  } catch (err) {
    alert(err.response?.data?.message || "Registration failed");
  } finally {
    isLoading.value = false;
  }
}
</script>