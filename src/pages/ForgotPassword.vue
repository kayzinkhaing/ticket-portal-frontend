<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#020617] flex flex-col font-[Inter,system-ui]">
    
    <div class="w-full flex justify-start px-8 py-6 border-b border-white/5">
      <span class="text-[#6c8ef5] font-semibold text-lg tracking-wide">
        SupportDesk
      </span>
    </div>

    <div class="flex flex-1">

      <div class="hidden lg:flex w-1/2 relative items-center justify-center px-24 overflow-hidden">
        <div class="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-[#6c8ef5]/20 blur-[150px] rounded-full"></div>
        <div class="absolute bottom-[-100px] right-[50px] w-[400px] h-[400px] bg-purple-500/20 blur-[150px] rounded-full"></div>

        <div class="relative z-10 max-w-lg">
          <h1 class="text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
            Build smarter<br />
            <span class="text-[#6c8ef5]">support experiences</span>
          </h1>
          <p class="text-gray-400 text-base leading-relaxed">
            Manage tickets, streamline communication, and deliver faster
            resolutions — all from one powerful and modern platform designed for
            growing teams.
          </p>
        </div>
      </div>

      <div class="flex flex-1 justify-center px-6 lg:px-20 pt-16 lg:pt-10">
        <div class="w-full max-w-md">

          <h2 class="text-white text-3xl font-semibold mb-2">
            Forgot password?
          </h2>
          <p class="text-gray-400 text-base mb-8">
            No worries, we'll send you reset instructions.
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="space-y-2">
              <input 
                v-model="email" 
                type="email" 
                placeholder="Enter your email address" 
                class="input"
                required
              />
            </div>

            <button 
              type="submit" 
              :disabled="isLoading" 
              class="w-full py-3 bg-[#6c8ef5] hover:bg-[#5a7be8] text-white font-semibold rounded-lg transition shadow-lg shadow-[#6c8ef5]/30 disabled:opacity-60"
            >
              <span v-if="!isLoading">Reset password</span>
              <span v-else>Sending link...</span>
            </button>
          </form>

          <div class="mt-8 pt-8 border-t border-white/5 text-center">
            <p class="text-gray-500 text-sm">
              Remember your password?
              <router-link to="/login" class="text-[#6c8ef5] hover:text-[#8aa5ff] ml-1 font-bold hover:underline">
                Sign in
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  isLoading.value = true
  // Mock API Call
  setTimeout(() => { 
    isLoading.value = false
    alert('Reset link sent to: ' + email.value) 
  }, 1500)
}
</script>

<style scoped>
/* Keeping your exact design system */
.input {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 15px;
  color: white;
  outline: none;
  transition: all 0.2s;
}
.input::placeholder { color: #6b7280; }
.input:focus { 
  border-color: #6c8ef5; 
  box-shadow: 0 0 0 1px rgba(108,142,245,0.4); 
}
</style>