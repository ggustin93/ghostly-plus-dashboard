<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import Auth from '@/components/Auth.vue';
import UserProfile from '@/components/UserProfile.vue';

const authStore = useAuthStore();

// The initializeAuthListener is already called in main.ts
// so the store should be up-to-date with the auth state.
</script>

<template>
  <div id="app-container">
    <header>
      <h1>GHOSTLY+ Dashboard</h1>
    </header>
    <main>
      <div v-if="authStore.isAuthenticated">
        <UserProfile />
      </div>
      <div v-else>
        <Auth />
      </div>
    </main>
    <footer>
      <p>&copy; 2025 GHOSTLY+ Project</p>
    </footer>
  </div>
</template>

<style scoped>
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

header {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}

main {
  flex-grow: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
  margin-top: auto;
}
</style>
