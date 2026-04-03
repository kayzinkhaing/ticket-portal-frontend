<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#020617] flex flex-col font-[Inter,system-ui]">
    
    <!-- Header -->
    <header class="w-full px-8 py-6 border-b border-white/5">
      <span class="text-[#6c8ef5] font-semibold text-lg tracking-wide">
        SupportDesk
      </span>
    </header>

    <!-- Main -->
    <main class="flex flex-1 items-center justify-center px-6 lg:px-20">
      <section class="w-full max-w-md text-center">

        <!-- Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 bg-[#6c8ef5]/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#6c8ef5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-white text-3xl font-semibold mb-4">
          Enter Verification Code
        </h1>

        <p class="text-gray-400 mb-4">
          We sent a 6-digit code to
          <span class="text-[#6c8ef5]">{{ email }}</span>
        </p>

        <!-- Timer -->
        <p class="text-gray-400 text-sm mb-6">
          OTP expires in
          <span class="text-[#6c8ef5]">
            {{ minutes }}:{{ formattedSeconds }}
          </span>
        </p>

        <!-- OTP Inputs -->
        <div class="relative mb-6">
          <div class="flex justify-center gap-2">
            <input
              v-for="(digit, index) in otp"
              :key="index"
              ref="otpInputs"
              type="text"
              maxlength="1"
              inputmode="numeric"
              :disabled="isLoading"
              class="otp-input"
              v-model="otp[index]"
              @input="handleInput(index)"
              @keydown.backspace="handleBackspace(index)"
            />
          </div>

          <!-- Loading Overlay -->
          <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
          >
            <LoadingSpinner size="md" />
          </div>
        </div>

        <!-- Message -->
        <p v-if="message && !isLoading" :class="messageClass">
          {{ message }}
        </p>

        <!-- Back -->
        <router-link
          to="/login"
          :class="[
            'mt-6 block text-sm font-medium transition',
            isLoading
              ? 'text-gray-500 pointer-events-none'
              : 'text-[#6c8ef5] hover:text-[#8aa5ff] hover:underline'
          ]"
        >
          Back to Login
        </router-link>

      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { AuthService } from "@/services/authService";

// Router
const route = useRoute();
const router = useRouter();

// State
const email = ref(route.query.email || "");
const otp = ref(["", "", "", "", "", ""]);
const otpInputs = ref([]);

const isLoading = ref(false);
const message = ref("");

// Timer
const timer = ref(60);
let interval = null;

// Computed
const minutes = computed(() => Math.floor(timer.value / 60));
const formattedSeconds = computed(() =>
  timer.value % 60 < 10 ? "0" + (timer.value % 60) : timer.value % 60
);

const messageClass = computed(() =>
  message.value.toLowerCase().includes("success")
    ? "text-green-400 text-sm mt-4"
    : "text-red-400 text-sm mt-4"
);

// Timer logic
const startTimer = () => {
  clearInterval(interval);
  timer.value = 60;

  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

// Input handlers
const handleInput = async (index) => {
  const value = otp.value[index];

  if (!/^[0-9]$/.test(value)) {
    otp.value[index] = "";
    return;
  }

  if (index < 5) {
    await nextTick();
    otpInputs.value[index + 1]?.focus();
  }

  if (otp.value.every(d => d !== "")) {
    verifyOtp();
  }
};

const handleBackspace = async (index) => {
  if (!otp.value[index] && index > 0) {
    await nextTick();
    otpInputs.value[index - 1]?.focus();
  }
};

// Verify OTP
const verifyOtp = async () => {
  if (isLoading.value) return;

  const code = otp.value.join("");

  if (code.length < 6) {
    message.value = "Please enter the 6-digit OTP code.";
    return;
  }

  isLoading.value = true;
  message.value = "";

  try {
    const res = await AuthService.verifyEmail(email.value, code);

    const data = res.data.data; // Correct access

    // Save auth info
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.organization) {
      localStorage.setItem("organization", JSON.stringify(data.organization));
    }

    message.value = "Email verified successfully!";
    clearInterval(interval);

    // Redirect based on role
    setTimeout(() => {
      if (data.role === "client") {
        router.push("/client/tickets/all");
      } else if (data.role === "agent") {
        router.push("/agent/dashboard");
      } else {
        router.push("/login");
      }
    }, 1200);

  } catch (err) {
    message.value =
      err.response?.data?.message || "Invalid or expired OTP code";
  } finally {
    isLoading.value = false;
  }
};

// Init
onMounted(() => {
  startTimer();

  nextTick(() => {
    otpInputs.value[0]?.focus();
  });
});
</script>

<style scoped>
.otp-input {
  width: 48px;
  height: 48px;
  text-align: center;
  font-size: 1.25rem;
  color: white;
  border-radius: 8px;
  border: 1px solid rgba(156, 163, 175, 0.6);
  background: transparent;
  transition: all 0.2s;
}

.otp-input:focus {
  border-color: #6c8ef5;
  box-shadow: 0 0 0 1px rgba(108, 142, 245, 0.5);
  outline: none;
}

.otp-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>