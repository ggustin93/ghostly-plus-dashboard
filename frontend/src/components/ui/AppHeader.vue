<script setup lang="ts">
import MedicalIcons from './MedicalIcons.vue';

defineProps<{
  isAuthenticated?: boolean;
}>();
</script>

<template>
  <header class="sticky top-0 z-10 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center">
      <!-- Logo and Brand -->
      <div class="flex items-center space-x-3">
        <MedicalIcons name="emg" size="md" class="text-primary" />
        <h1 class="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          GHOSTLY<span class="text-primary">+</span>
        </h1>
      </div>
      
      <!-- Authenticated User Section -->
      <div v-if="isAuthenticated" class="absolute right-4 sm:right-6 lg:right-8 flex items-center space-x-4">
        <span class="text-sm font-primary text-muted-foreground hidden sm:inline-block">
          Welcome back!
        </span>
        <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <MedicalIcons name="patient" size="sm" />
        </div>
      </div>
    </div>
  </header>
</template> 