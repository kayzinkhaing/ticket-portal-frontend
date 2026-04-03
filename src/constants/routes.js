// src/constants/routes.js

export const ROUTES = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    verifyEmail: '/auth/verify-email',
    resendCode: '/auth/resend-code',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    resendCodePassword: '/auth/resend-code-password',
    google: '/auth/google',
    github: '/auth/github',
    logout: '/v1/logout',
    emailVerificationPrompt: '/v1/verify-email',
    emailVerify: (id, hash) => `/v1/verify-email/${id}/${hash}`,
    sendVerificationNotification: '/v1/email/verification-notification',
    confirmPassword: '/v1/confirm-password',
    changePassword: '/v1/change-password',
    updatePassword: '/v1/password',
    twoFactor: {
      enable: '/v1/two-factor/enable',
      disable: '/v1/two-factor/disable',
      verify: '/v1/two-factor/verify',
    },
  },

  users: {
    list: '/v1/users',
    agent: '/v1/agents',
    item: (id) => `/v1/users/${id}`,
    create: '/v1/users',
    update: (id) => `/v1/users/${id}`,
    delete: (id) => `/v1/users/${id}`,
  },

  organizations: {
    list: '/v1/organizations',
    item: (id) => `/v1/organizations/${id}`,
    create: '/v1/organizations',
    update: (id) => `/v1/organizations/${id}`,
    delete: (id) => `/v1/organizations/${id}`,
  },

  clientProfiles: {
    list: '/v1/client-profiles',
    item: (id) => `/v1/client-profiles/${id}`,
    create: '/v1/client-profiles',
    update: (id) => `/v1/client-profiles/${id}`,
    delete: (id) => `/v1/client-profiles/${id}`,
  },

  roles: {
    list: '/v1/roles',
    item: (id) => `/v1/roles/${id}`,
    create: '/v1/roles',
    update: (id) => `/v1/roles/${id}`,
    delete: (id) => `/v1/roles/${id}`,
  },

  ticketStatuses: {
    list: '/v1/ticket-statuses',
    item: (id) => `/v1/ticket-statuses/${id}`,
    create: '/v1/ticket-statuses',
    update: (id) => `/v1/ticket-statuses/${id}`,
    delete: (id) => `/v1/ticket-statuses/${id}`,
  },

  ticketPriorities: {
    list: '/v1/ticket-priorities',
    item: (id) => `/v1/ticket-priorities/${id}`,
    create: '/v1/ticket-priorities',
    update: (id) => `/v1/ticket-priorities/${id}`,
    delete: (id) => `/v1/ticket-priorities/${id}`,
  },
//Route::get('tickets/organization', [TicketController::class, 'organizationTickets']);
  tickets: {
    list: '/v1/tickets',
    ticketOrg: '/v1/tickets/organization',
    ticketAdvancedSearch: '/v1/tickets/advanced-search',
    status: '/v1/tickets/status',             
    statusCounts: '/v1/tickets/status-counts',
    item: (id) => `/v1/tickets/${id}`,
    create: '/v1/tickets',
    update: (id) => `/v1/tickets/${id}`,
    delete: (id) => `/v1/tickets/${id}`,
  },

  comments: {
    list: '/v1/comments',
    item: (id) => `/v1/comments/${id}`,
    create: '/v1/comments',
    update: (id) => `/v1/comments/${id}`,
    delete: (id) => `/v1/comments/${id}`,
  },

  ticketStatusHistories: {
    list: '/v1/ticket-status-histories',
    item: (id) => `/v1/ticket-status-histories/${id}`,
    create: '/v1/ticket-status-histories',
    update: (id) => `/v1/ticket-status-histories/${id}`,
    delete: (id) => `/v1/ticket-status-histories/${id}`,
  },
  dashboard: { url: '/v1/dashboard' },


  commonTables: {
    list: '/v1/common-tables',
    item: (id) => `/v1/common-tables/${id}`,
    create: '/v1/common-tables',
    update: (id) => `/v1/common-tables/${id}`,
    delete: (id) => `/v1/common-tables/${id}`,
  },
};