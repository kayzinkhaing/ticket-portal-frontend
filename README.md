

---

# ✅ 📄 **Frontend README.md (Vue 3 + Vite + Tailwind)**

```markdown id="f3c8v1"
# 🎫 Ticket Portal Frontend (Vue 3)

A modern, scalable frontend for the Ticket Management System built with Vue 3, Vite, and TailwindCSS.  
This application consumes a Laravel API backend and provides role-based interfaces for Client Users and Support Agents.

The frontend is designed using reusable components, clean routing, and performance-focused best practices.

---

## 🚀 Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: TailwindCSS + custom CSS
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Routing**: Vue Router (lazy loading enabled)
- **Containerization**: Docker

---

## 🧠 Architecture Overview

The frontend follows a **modular and scalable architecture**:

```

src/
├── components/     # Reusable UI components
├── pages/          # Page-level views
├── layouts/        # Layout wrappers (Auth / Dashboard)
├── router/         # Route definitions
├── services/       # API service layer
├── stores/         # State management (Pinia)
├── composables/    # Reusable logic (hooks)
├── constants/      # Static values
├── assets/         # Static assets

```id="qpxk31"

---

## 🧩 Design Principles

### Reusability

- Shared UI components (inputs, buttons, forms)
- Centralized API service layer
- Reusable composables for logic (auth, validation, API calls)

---

### Separation of Concerns

- UI → components/pages
- Logic → composables
- API → services
- State → stores

---

### Clean Code Practices

- Consistent naming conventions
- Standard API request format
- Centralized error handling

---

## 🔐 Authentication & Authorization

- Token-based authentication (Laravel Passport)
- Token stored securely (via localStorage/session strategy)
- Role-based UI rendering

### Roles

#### Client User
- Access own organization tickets
- Cannot view internal notes

#### Support Agent
- Access all tickets
- Can manage ticket lifecycle

---

## 🔀 Routing Structure

### Clean Route Design

- Organized by module (tickets, users, dashboard)
- Dynamic routing based on user roles

### Example:

```

/client/dashboard
/client/tickets
/agent/dashboard
/agent/tickets

```id="p2z91k"

---

### Lazy Loading

All routes are **lazy-loaded** for performance:

```

const TicketPage = () => import('@/pages/tickets/TicketPage.vue')

```id="m6v4gh"

---

## 🎨 UI & UX

- Built with TailwindCSS
- Responsive layout
- Clean and minimal interface
- Consistent form validation UI
- Loading indicators & error states

---

## 🔗 API Integration

### Base Configuration

```

Frontend: [http://localhost:5173](http://localhost:5173)
Backend:  [http://localhost:8080/api](http://localhost:8080/api)

```id="z9jqhb"

---

### API Service Layer

- Centralized Axios instance (`api.js`)
- Standard request/response handling
- Token injection via interceptors
- Global error handling

---

## 📦 Features

### 🎫 Ticket Management

- Ticket list with pagination
- Ticket detail view
- Create / update tickets
- SLA indicators (from backend)

---

### 🔍 Advanced Search

- Integrated with backend advanced search API
- Supports:
  - Keyword
  - Status
  - Priority
  - Organization
  - Date range

---

### 📄 Pagination

- Backend-driven pagination
- Dynamic page updates
- Efficient data loading

---

### 💬 Comments

- Add comments
- View comments per ticket
- Role-based visibility (internal notes hidden for clients)

---

## 🧠 State Management (Pinia)

- Auth store (user, token, role)
- Ticket store (list, filters, pagination)
- Global loading & error states

---

## 🧪 Validation

- Frontend validation (form-level)
- Backend validation (API response)
- Standardized error display

---

## ⚡ Performance Optimization

- Lazy-loaded routes
- API request debouncing (for search)
- Pagination (no large data load)
- Component reuse to reduce duplication

---

## 🔐 Security Considerations

- Token-based authentication
- Protected routes via router guards
- Role-based UI rendering
- Input validation (frontend + backend)
- No sensitive data stored in client

---

## 🐳 Docker Setup

### 1. Clone Repository

```

git clone [https://github.com/kayzinkhaing/ticket-portal-frontend](https://github.com/kayzinkhaing/ticket-portal-frontend)

```id="u8z2bc"

---

### 2. Run Docker

```

cd docker
docker compose -p frontendtp up -d --build

```id="htb1ks"

---

### 3. Access Container

```

docker compose -p frontendtp exec frontend ash

```id="7r01mj"

---

### 4. Access Application

```

[http://localhost:5173](http://localhost:5173)

```id="f5tg32"

---

## 🔗 Backend Connection

Ensure backend is running:

```

[http://localhost:8080/api](http://localhost:8080/api)

```id="i93q5q"

Frontend and backend communicate via Docker network.

---

## ⚠️ Current Limitations

- OAuth login (Google/GitHub) not yet implemented in UI
- Two-factor authentication UI not yet implemented
- Password confirmation UI not yet implemented
- Limited UI for admin-level configurations

---

## ⏱️ Timebox Scope

### Implemented

- Authentication (basic login/register)
- Ticket management
- Pagination & advanced search
- Role-based routing
- Clean component architecture

---

### Not Implemented

- OAuth UI integration
- Real-time notifications
- Full dashboard analytics

---

## 🚧 Next Steps

- Implement OAuth UI flows
- Add real-time updates (WebSockets)
- Improve UI/UX (animations, transitions)
- Add global notification system
- Expand test coverage (Vue Test Utils / Vitest)

---

## 📎 Repository

https://github.com/kayzinkhaing/ticket-portal-frontend
```

---
