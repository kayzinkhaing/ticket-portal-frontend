<template>
  <div class="stat-card group">
    
    <!-- Top label -->
    <p class="label">{{ label }}</p>

    <!-- Main row -->
    <div class="flex items-end justify-between">
      <h2 class="count">{{ count }}</h2>
      <span class="sub">{{ sub }}</span>
    </div>

    <!-- Bottom line -->
    <div class="line"></div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  count: { type: Number, required: true },
  sub:   { type: String, required: true },
});
</script>

<style scoped>
.stat-card {
  padding: 12px 14px;              /* 🔥 smaller padding */
  border-radius: 14px;
  background: rgba(30, 33, 48, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.25s ease;
}

/* hover (subtle only) */
.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(139, 92, 246, 0.25);
}

/* text styles */
.label {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 6px;
}

.count {
  font-size: 22px;     /* 🔥 smaller number */
  font-weight: 700;
  color: #e8eaf6;
}

.sub {
  font-size: 11px;
  color: #6b7280;
}

/* bottom accent */
.line {
  margin-top: 6px;
  height: 2px;
  width: 40%;
  background: linear-gradient(to right, #8b5cf6, transparent);
  opacity: 0.7;
}
</style>