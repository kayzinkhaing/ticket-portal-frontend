// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

/* ── Lazy Load Layouts ───────────────────── */
const ClientLayout = () => import("../layouts/ClientLayout.vue");
const AgentLayout  = () => import("../layouts/AgentLayout.vue");

/* ── Lazy Load Public Pages ─────────────── */
const LoginView        = () => import("../pages/LoginView.vue");
const RegisterView     = () => import("../pages/RegisterView.vue");
const VerifyEmailView  = () => import("../pages/VerifyEmailView.vue");
const ForgotPassword   = () => import("../pages/ForgotPassword.vue");

/* ── Lazy Load Client Pages ─────────────── */
const Dashboard         = () => import("../pages/client/Dashboard.vue");
const TicketsAll        = () => import("../pages/client/TicketsAll.vue");
const TicketsOpen       = () => import("../pages/client/TicketsOpen.vue");
const TicketsInProgress = () => import("../pages/client/TicketsInProgress.vue");
const TicketsResolved   = () => import("../pages/client/TicketsResolved.vue");
const TicketsOverdue    = () => import("../pages/client/TicketsOverdue.vue");
const TicketDetail      = () => import("../pages/client/TicketDetail.vue");
const CreateTicket      = () => import("../pages/client/CreateTicket.vue");
const Profile           = () => import("../pages/client/Profile.vue");
const TeamTickets       = () => import("../pages/client/TeamTickets.vue");

// NEW: Dynamic Organization Details Page
const OrganizationDetails = () => import("../pages/client/OrganizationDetails.vue");

/* ── Lazy Load Agent Pages ─────────────── */
const AgentDashboard         = () => import("../pages/agent/Dashboard.vue");
const AgentTicketsAll        = () => import("../pages/agent/TicketsAll.vue");
const AgentTicketsOpen       = () => import("../pages/agent/TicketsOpen.vue");
const AgentTicketsInProgress = () => import("../pages/agent/TicketsInProgress.vue");
const AgentTicketsResolved   = () => import("../pages/agent/TicketsResolved.vue");
const AgentTicketsOverdue    = () => import("../pages/agent/TicketsOverdue.vue");
const AgentTicketDetail      = () => import("../pages/agent/TicketDetail.vue");
const AgentProfile           = () => import("../pages/agent/Profile.vue");
const SlaSettings            = () => import("../pages/agent/SlaSettings.vue");

/* ── Routes ───────────────────────────── */
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/verify-email", component: VerifyEmailView },
  { path: "/forgot-password", component: ForgotPassword },

  {
    path: "/client",
    component: ClientLayout,
    redirect: "/client/tickets/all",
    meta: { requiresAuth: true, role: "client" },
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "tickets/all", component: TicketsAll },
      { path: "tickets/open", component: TicketsOpen },
      { path: "tickets/in-progress", component: TicketsInProgress },
      { path: "tickets/resolved", component: TicketsResolved },
      { path: "tickets/overdue", component: TicketsOverdue },
      { path: "tickets/:id", component: TicketDetail },
      { path: "create-ticket", component: CreateTicket },
      { path: "profile", component: Profile },
      { path: "team-tickets", component: TeamTickets },
      
      // UPDATED: Dynamic route for Organizations
      { 
        path: "organization/:id", 
        name: "organization-details", 
        component: OrganizationDetails 
      },
    ],
  },

  {
    path: "/agent",
    component: AgentLayout,
    redirect: "/agent/tickets/all",
    meta: { requiresAuth: true, role: "agent" },
    children: [
      { path: "dashboard", component: AgentDashboard },
      { path: "tickets/all", component: AgentTicketsAll },
      { path: "tickets/open", component: AgentTicketsOpen },
      { path: "tickets/in-progress", component: AgentTicketsInProgress },
      { path: "tickets/resolved", component: AgentTicketsResolved },
      { path: "tickets/overdue", component: AgentTicketsOverdue },
      { path: "tickets/:id", component: AgentTicketDetail },
      { path: "profile", component: AgentProfile },
      { path: "sla-settings", component: SlaSettings },
    ],
  },
];

/* ── Router ───────────────────────────── */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* ── Navigation Guard ─────────────────── */
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const publicPages = ["/login", "/register", "/forgot-password", "/verify-email"];
  const isPublicPage = publicPages.includes(to.path);

  if (auth.token && !auth.user && !auth.isLoading) {
    try {
      await auth.fetchUser();
    } catch (error) {
      console.error("Session expired, clearing auth...");
      auth.clearUser();
      if (isPublicPage) return next();
      return next("/login");
    }
  }

  if (!auth.isAuthenticated && isPublicPage) {
    return next();
  }

  if (auth.isAuthenticated && auth.user && isPublicPage) {
    const dashboard = auth.user.role === "agent"
      ? "/agent/tickets/all"
      : "/client/tickets/all";
    return next(dashboard);
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next("/login");
  }

  if (to.meta.role && auth.isAuthenticated && auth.user?.role !== to.meta.role) {
    const dashboard = auth.user.role === "agent"
      ? "/agent/tickets/all"
      : "/client/tickets/all";
    return next(dashboard);
  }

  next();
});

export default router;