<script setup lang="ts">
import MedicalIcons from './MedicalIcons.vue';
</script>

<template>
  <footer class="border-t bg-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand Information -->
        <div>
          <div class="flex items-center space-x-2 mb-3">
            <MedicalIcons name="emg" size="sm" class="text-primary" />
            <span class="font-display font-medium text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              GHOSTLY<span class="text-primary">+</span>
            </span>
          </div>
          <p class="text-sm text-muted-foreground max-w-md leading-relaxed text-left">
            Secure monitoring for EMG signals and rehabilitation progress tracking for hospitalized elderly patients.
          </p>
        
        </div>
        
        <!-- Footer Navigation - Resources -->
        <div>
          <h3 class="font-display text-sm font-medium tracking-wider uppercase mb-3 text-primary/90">Resources</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a 
                href="https://github.com/ggustin93/ghostly-plus-dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                aria-label="GitHub repository"
              >
                <svg class="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
                <span class="group-hover:underline">GitHub</span>
              </a>
            </li>
            <li>
              <a href="#" class="text-muted-foreground hover:text-primary transition-colors hover:underline">
                Documentation
              </a>
            </li>
            
          </ul>
        </div>
        
        <!-- Legal Column -->
        <div>
          <h3 class="font-display text-sm font-medium tracking-wider uppercase mb-3 text-primary/90">Legal</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="text-muted-foreground hover:text-primary transition-colors hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" class="text-muted-foreground hover:text-primary transition-colors hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" class="text-muted-foreground hover:text-primary transition-colors hover:underline">
                GDPR Compliance
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="mt-6 pt-4 border-t text-center">
        <p class="text-xs text-muted-foreground">
          &copy; {{ new Date().getFullYear() }} GHOSTLY+ Project. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template> 