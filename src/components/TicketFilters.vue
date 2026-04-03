<template>
  <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
    <!-- ✅ ONLY Advanced Search -->
    <AdvancedSearch v-model:filters="filters" />
  </div>
</template>

<script setup>
import AdvancedSearch from "./AdvancedSearch.vue";

// ✅ use v-model:filters
const filters = defineModel("filters");
</script>