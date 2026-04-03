<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#020617] flex flex-col font-[Inter,system-ui]">
    <!-- TOP HEADER -->
    <div class="w-full flex justify-start px-8 py-6 border-b border-white/5">
      <span class="text-[#6c8ef5] font-semibold text-lg tracking-wide">SupportDesk</span>
    </div>

    <div class="flex flex-1">
      <!-- LEFT SIDE -->
      <div class="hidden lg:flex w-1/2 relative items-center justify-center px-24 overflow-hidden">
        <div class="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-[#6c8ef5]/20 blur-[150px] rounded-full"></div>
        <div class="absolute bottom-[-100px] right-[50px] w-[400px] h-[400px] bg-purple-500/20 blur-[150px] rounded-full"></div>

        <div class="relative z-10 max-w-lg">
          <h1 class="text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
            Build smarter<br />
            <span class="text-[#6c8ef5]">support experiences</span>
          </h1>
          <p class="text-gray-400 text-base leading-relaxed">
            Manage tickets, streamline communication, and deliver faster resolutions — all from one modern platform.
          </p>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div class="flex flex-1 justify-center px-6 lg:px-20 pt-16 lg:pt-10">
        <div class="w-full max-w-md">
          <h2 class="text-white text-3xl font-semibold mb-2">Sign in to your account</h2>
          <p class="text-gray-400 text-base mb-8">Enter your credentials to continue</p>

          <form @submit.prevent="handleSubmit" class="space-y-5">

            <!-- ✅ EMAIL -->
            <div>
              <input
                v-model="form.email"
                type="text"
                placeholder="Email"
                class="input"
                :class="errors.email ? 'border-red-500' : ''"
              />
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">
                {{ errors.email }}
              </p>
            </div>

            <!-- ✅ PASSWORD -->
            <div>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Password"
                  class="input pr-10"
                  :class="errors.password ? 'border-red-500' : ''"
                />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="text-red-500 text-xs mt-1">
                {{ errors.password }}
              </p>
            </div>

            <div class="text-right">
              <router-link to="/forgot-password" class="text-sm text-[#6c8ef5] hover:text-[#8aa5ff]">
                Forgot password?
              </router-link>
            </div>

            <button type="submit"
              :disabled="isLoading"
              class="w-full py-3 bg-[#6c8ef5] hover:bg-[#5a7be8] text-white font-semibold rounded-lg transition shadow-lg shadow-[#6c8ef5]/30 disabled:opacity-60">
              <span v-if="!isLoading">Sign In →</span>
              <span v-else>Loading...</span>
            </button>
          </form>

          <p class="text-gray-500 text-sm mt-8">
            Don’t have an account?
            <router-link to="/register"
              class="text-[#6c8ef5] hover:text-[#8aa5ff] hover:underline ml-1 font-bold">
              Create one
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const showPassword = ref(false)
const isLoading = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

function validate() {
  errors.email = ''
  errors.password = ''

  let valid = true

  if (!form.email) {
    errors.email = 'Email is required'
    valid = false
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Invalid email format'
    valid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = 'Minimum 6 characters'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  isLoading.value = true
  try {
    const redirectPath = await auth.login({
      email: form.email,
      password: form.password
    })
    router.push(redirectPath)
  } catch (err) {
    alert(err.response?.data?.message || "Login failed")
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
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