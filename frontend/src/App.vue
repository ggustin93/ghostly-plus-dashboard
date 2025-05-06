<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-background to-muted/20">
    <div class="container mx-auto px-4 py-10">
      <!-- Header with logos -->
      <div class="flex justify-center mb-10">
        <div class="flex items-center space-x-6">
          <a href="https://vitejs.dev" target="_blank" class="transition-transform hover:scale-110">
            <img src="/vite.svg" class="logo h-16 w-16" alt="Vite logo" />
          </a>
          <div class="h-10 w-px bg-border"></div>
          <a href="https://vuejs.org/" target="_blank" class="transition-transform hover:scale-110">
            <img src="./assets/vue.svg" class="logo h-14 w-14" alt="Vue logo" />
          </a>
          <div class="h-10 w-px bg-border"></div>
          <a href="https://shadcn-vue.com/" target="_blank" class="transition-transform hover:scale-110">
            <span class="font-bold text-lg">shadcn/vue</span>
          </a>
        </div>
      </div>
      
      <!-- Main content -->
      <HelloWorld msg="Modern Vue Application" />
      
      <!-- Footer -->
      <footer class="mt-16 text-center text-sm text-muted-foreground">
        <p>Built with Vue 3, Vite, Tailwind CSS and shadcn/ui</p>
      </footer>
    </div>
  </div>
</template>

<style>
/* Global styles can go here */
</style>
