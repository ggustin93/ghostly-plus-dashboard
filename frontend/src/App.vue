<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import Auth from '@/components/Auth.vue';
import UserProfile from '@/components/UserProfile.vue';
import AppHeader from '@/components/ui/AppHeader.vue';
import AppFooter from '@/components/ui/AppFooter.vue';

const authStore = useAuthStore();

// The initializeAuthListener is already called in main.ts
// so the store should be up-to-date with the auth state.
</script>

<template>
  <div id="app-container" class="font-primary">
    <!-- Use the AppHeader component -->
    <AppHeader :isAuthenticated="authStore.isAuthenticated" />

    <!-- Main Content -->
    <main class="bg-gradient-to-b from-white to-gray-50">
      <div v-if="authStore.isAuthenticated">
        <UserProfile />
      </div>
      <div v-else>
        <Auth />
      </div>
    </main>

    <!-- Use the AppFooter component -->
    <AppFooter />
  </div>
</template>

<style>
/* These styles will be applied to this component */
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: var(--font-primary);
}

main {
  flex-grow: 1;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Custom link styles */
a {
  position: relative;
  text-decoration: none;
}

/* Animated underline effect for footer links */
.hover\:underline:hover::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: currentColor;
  transform: scaleX(1);
  transform-origin: bottom left;
  transition: transform 0.3s ease-out;
}
</style>
