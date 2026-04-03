<template>
  <div class="app-shell">
    <!-- Aurora background -->
    <div class="aurora">
      <div class="aurora-blob a1"></div>
      <div class="aurora-blob a2"></div>
      <div class="aurora-blob a3"></div>
    </div>
    <div class="noise-overlay"></div>

    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Logo -->
      <div class="brand">
        <div class="brand-icon">
          <span>S</span>
        </div>
        <div class="brand-text">
          <span class="brand-name">Support HQ</span>
          <span class="brand-plan">Premium Concierge</span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="nav-section">
        <p class="nav-label">Tickets</p>
        <router-link class="nav-item" to="/client/tickets" exact-active-class="active">
          <span class="nav-icon">◎</span> <span>Open</span> <span class="nav-count">5</span>
        </router-link>
        <router-link class="nav-item active-always" to="/client/tickets" active-class="active">
          <span class="nav-icon">▦</span> <span>All Tickets</span> <span class="nav-count hi">16</span>
        </router-link>
        <router-link class="nav-item" to="/client/tickets" active-class="active">
          <span class="nav-icon">◈</span> <span>In Progress</span> <span class="nav-count">4</span>
        </router-link>
        <router-link class="nav-item" to="/client/tickets" active-class="active">
          <span class="nav-icon">◉</span> <span>Resolved</span> <span class="nav-count">1</span>
        </router-link>
        <router-link class="nav-item" to="/client/tickets" active-class="active">
          <span class="nav-icon overdue-icon">◬</span> <span>Overdue</span> <span class="nav-count danger">2</span>
        </router-link>
      </nav>

      <nav class="nav-section">
        <p class="nav-label">Organization</p>
        <router-link class="nav-item" to="/client/dashboard" active-class="active">
          <span class="nav-icon">◫</span> <span>Acme Corp</span>
        </router-link>
        <router-link class="nav-item" to="/client/dashboard" active-class="active">
          <span class="nav-icon">◭</span> <span>Team Tickets</span>
        </router-link>
      </nav>

      <!-- Spacer -->
      <div class="sidebar-spacer"></div>

      <!-- Bottom -->
      <div class="sidebar-bottom">
        <router-link class="nav-item" to="/client/profile" active-class="active">
          <span class="nav-icon">?</span> <span>Help</span>
        </router-link>
        <button class="nav-item logout" @click="logout">
          <span class="nav-icon">⏻</span> <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="content-area">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="topbar-back" v-if="$route.path !== '/client/dashboard'" @click="$router.back()">←</button>
        </div>
        <div class="topbar-right">
          <div class="status-pill">
            <span class="status-dot"></span> Online
          </div>
          <div class="user-avatar" @click="$router.push('/client/profile')">CL</div>
        </div>
      </header>

      <!-- Scrollable page -->
      <main class="page-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function logout() { router.push('/login') }
</script>

<style>
/* Global reset + fonts */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #app { height: 100%; width: 100%; overflow: hidden; }
body { font-family: 'Syne', sans-serif; background: #070711; color: #fff; }
</style>

<style scoped>
.app-shell {
  display: flex; width: 100vw; height: 100vh; overflow: hidden;
  background: #070711; position: relative;
}

/* Aurora Background */
.aurora { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.aurora-blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.18; animation: float 12s ease-in-out infinite; }
.a1 { width: 600px; height: 600px; background: radial-gradient(circle, #4f8fff, transparent); top: -200px; left: -100px; animation-delay: 0s; }
.a2 { width: 500px; height: 500px; background: radial-gradient(circle, #a855f7, transparent); bottom: -100px; right: 0px; animation-delay: -4s; }
.a3 { width: 400px; height: 400px; background: radial-gradient(circle, #22d3a0, transparent); top: 40%; left: 40%; animation-delay: -8s; }
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -40px) scale(1.08); }
}
.noise-overlay {
  position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px;
}

/* Sidebar */
.sidebar {
  width: 240px; flex-shrink: 0; height: 100vh; padding: 24px 16px;
  display: flex; flex-direction: column; gap: 0;
  background: rgba(255,255,255,0.03);
  border-right: 1px solid rgba(255,255,255,0.07);
  backdrop-filter: blur(30px);
  position: relative; z-index: 10;
}

.brand { display: flex; align-items: center; gap: 12px; padding: 6px 8px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 20px; }
.brand-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #4f8fff, #a855f7); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; color: #fff; box-shadow: 0 4px 14px rgba(79,143,255,0.4); flex-shrink: 0; }
.brand-name { display: block; font-size: 0.9rem; font-weight: 800; color: #fff; }
.brand-plan { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.35); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

.nav-section { display: flex; flex-direction: column; gap: 2px; margin-bottom: 20px; }
.nav-label { font-size: 0.6rem; font-weight: 700; color: rgba(255,255,255,0.25); letter-spacing: 0.12em; text-transform: uppercase; padding: 0 10px 8px; }
.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 12px;
  text-decoration: none; color: rgba(255,255,255,0.45); font-size: 0.82rem; font-weight: 600;
  transition: all 0.2s; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'Syne', sans-serif;
}
.nav-item:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.05); }
.nav-item.active, .nav-item.router-link-active { color: #fff; background: rgba(79,143,255,0.12); border: 1px solid rgba(79,143,255,0.2); }
.nav-icon { font-size: 0.9rem; flex-shrink: 0; width: 18px; text-align: center; }
.overdue-icon { color: rgba(248,113,113,0.7); }
.nav-item .nav-icon + span { flex: 1; }
.nav-count { font-size: 0.65rem; font-weight: 800; padding: 2px 7px; border-radius: 20px; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); margin-left: auto; }
.nav-count.hi { background: rgba(79,143,255,0.2); color: #4f8fff; }
.nav-count.danger { background: rgba(248,113,113,0.2); color: #f87171; }

.sidebar-spacer { flex: 1; }
.sidebar-bottom { display: flex; flex-direction: column; gap: 2px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; }
.logout { color: rgba(248,113,113,0.6) !important; }
.logout:hover { color: #f87171 !important; background: rgba(248,113,113,0.08) !important; }

/* Main Content Area */
.content-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; z-index: 5; }

.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 32px; border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); flex-shrink: 0;
}
.topbar-left { }
.topbar-back { background: none; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.8rem; cursor: pointer; }
.topbar-right { display: flex; align-items: center; gap: 14px; }
.status-pill { display: flex; align-items: center; gap: 7px; background: rgba(34,211,160,0.1); border: 1px solid rgba(34,211,160,0.25); border-radius: 20px; padding: 5px 12px; font-size: 0.72rem; font-weight: 700; color: #22d3a0; letter-spacing: 0.06em; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: #22d3a0; box-shadow: 0 0 6px #22d3a0; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #4f8fff, #a855f7); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: #fff; cursor: pointer; box-shadow: 0 2px 12px rgba(79,143,255,0.4); }

.page-content { flex: 1; overflow-y: auto; padding: 32px; }
.page-content::-webkit-scrollbar { width: 6px; }
.page-content::-webkit-scrollbar-track { background: transparent; }
.page-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
.page-content::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
</style>