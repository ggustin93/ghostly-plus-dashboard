<script setup lang="ts">
import { ref, onMounted } from 'vue';

const fontsLoaded = ref(false);
const fontPrimaryLoaded = ref(false);
const fontDisplayLoaded = ref(false);
const isDev = ref(import.meta.env.DEV || false);
const isVisible = ref(true);

// Using the Font Loading API to check if fonts are properly loaded
onMounted(() => {
  if ('fonts' in document) {
    Promise.all([
      document.fonts.load('1em Montserrat'),
      document.fonts.load('1em "Libre Baskerville"')
    ]).then(() => {
      // Check after a small delay to ensure fonts are registered
      setTimeout(() => {
        fontPrimaryLoaded.value = document.fonts.check('1em Montserrat');
        fontDisplayLoaded.value = document.fonts.check('1em "Libre Baskerville"');
        fontsLoaded.value = fontPrimaryLoaded.value && fontDisplayLoaded.value;
        console.log('Fonts loaded:', fontsLoaded.value);
        console.log('Primary font (Montserrat) loaded:', fontPrimaryLoaded.value);
        console.log('Display font (Libre Baskerville) loaded:', fontDisplayLoaded.value);
      }, 500);
    });
  }
});

const hideFontChecker = () => {
  isVisible.value = false;
};
</script>

<template>
  <div 
    v-if="isDev && isVisible" 
    class="fixed bottom-4 right-4 p-3 bg-white/95 border rounded-md shadow-sm z-50 text-xs animate-in fade-in slide-in-from-bottom-5"
  >
    <div class="flex justify-between items-center mb-2">
      <span class="font-display text-xs font-bold text-primary">Font Checker</span>
      <button @click="hideFontChecker" class="text-muted-foreground hover:text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="space-y-1.5">
      <div>
        <span class="font-bold">Font Status:</span> 
        <span :class="fontsLoaded ? 'text-green-600' : 'text-red-600'">
          {{ fontsLoaded ? '✓ Loaded' : '✗ Not Loaded' }}
        </span>
      </div>
      <div>
        <span class="font-bold">Montserrat:</span> 
        <span :class="fontPrimaryLoaded ? 'text-green-600' : 'text-red-600'">
          {{ fontPrimaryLoaded ? '✓' : '✗' }}
        </span>
        <span class="ml-1 font-primary italic text-muted-foreground">Sample</span>
      </div>
      <div>
        <span class="font-bold">Libre Baskerville:</span> 
        <span :class="fontDisplayLoaded ? 'text-green-600' : 'text-red-600'">
          {{ fontDisplayLoaded ? '✓' : '✗' }}
        </span>
        <span class="ml-1 font-display italic text-muted-foreground">Sample</span>
      </div>
    </div>
  </div>
</template> 