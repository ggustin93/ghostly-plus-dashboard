<template>
  <Card class="w-full max-w-md mx-auto my-8 shadow-lg">
    <CardHeader class="text-center pb-4">
      <CardTitle class="text-2xl font-bold font-display">Sign In</CardTitle>
      <CardDescription class="text-sm">Access your EMG monitoring dashboard</CardDescription>
    </CardHeader>

    <CardContent class="px-6 pb-6">
      <!-- Tab navigation -->
      <div class="flex border-b mb-6">
        <button 
          @click="activeTab = 'signin'" 
          class="py-2 px-4 text-sm font-medium transition-colors relative"
          :class="activeTab === 'signin' ? 'text-primary' : 'text-muted-foreground hover:text-primary'"
        >
          Sign In
          <div v-if="activeTab === 'signin'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
        </button>
        <button 
          @click="activeTab = 'reset'" 
          class="py-2 px-4 text-sm font-medium transition-colors relative"
          :class="activeTab === 'reset' ? 'text-primary' : 'text-muted-foreground hover:text-primary'"
        >
          Reset Password
          <div v-if="activeTab === 'reset'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
        </button>
      </div>

      <!-- Error Display -->
      <Alert v-if="authStore.error && !signInError && !resetError" variant="destructive" class="mb-4 animate-in fade-in">
        <AlertCircle class="w-4 h-4 mr-2" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>{{ authStore.error.message }}</AlertDescription>
      </Alert>

      <!-- Sign In Form -->
      <div v-if="activeTab === 'signin'" class="space-y-5 animate-in fade-in slide-in-from-left-1">
        <Alert v-if="signInError" variant="destructive" class="mb-4">
          <AlertCircle class="w-4 h-4 mr-2" />
          <AlertDescription>{{ signInError }}</AlertDescription>
        </Alert>
        
        <form class="space-y-4">
          <div class="space-y-2">
            <Label for="signin-email" class="text-sm font-medium">Email address</Label>
            <Input 
              id="signin-email" 
              type="email" 
              placeholder="you@example.com" 
              v-model="signInEmail" 
              required 
              class="h-10"
            />
          </div>
          
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="signin-password" class="text-sm font-medium">Password</Label>
              <button 
                type="button" 
                @click="activeTab = 'reset'" 
                class="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Input 
              id="signin-password" 
              type="password" 
              v-model="signInPassword" 
              required 
              class="h-10"
            />
          </div>
          
          <Button 
            type="button" 
            :disabled="authStore.loading" 
            class="w-full h-10 mt-2 !bg-blue-600 text-white shadow-xs !hover:bg-blue-700"
            @click="handleSignIn"
          >
            <template v-if="authStore.loading">
              <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Signing In
            </template>
            <template v-else>Sign In</template>
          </Button>
        </form>
      </div>

      <!-- Password Reset Form -->
      <div v-if="activeTab === 'reset'" class="space-y-5 animate-in fade-in slide-in-from-right-1">
        <Alert v-if="resetError" variant="destructive" class="mb-4">
          <AlertCircle class="w-4 h-4 mr-2" />
          <AlertDescription>{{ resetError }}</AlertDescription>
        </Alert>
        
        <Alert v-if="resetSuccessMessage" variant="default" class="mb-4 bg-green-50 text-green-800 border-green-200">
          <CheckCircle class="w-4 h-4 mr-2" />
          <AlertDescription>{{ resetSuccessMessage }}</AlertDescription>
        </Alert>
        
        <div class="text-sm text-muted-foreground mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </div>
        
        <form class="space-y-4">
          <div class="space-y-2">
            <Label for="reset-email" class="text-sm font-medium">Email address</Label>
            <Input 
              id="reset-email" 
              type="email" 
              placeholder="you@example.com" 
              v-model="resetEmail" 
              required 
              class="h-10"
            />
          </div>
          
          <Button 
            type="button" 
            :disabled="authStore.loading" 
            class="w-full h-10 mt-2"
            variant="secondary"
            @click="handlePasswordReset"
          >
            <template v-if="authStore.loading">
              <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Sending Email
            </template>
            <template v-else>Send Reset Link</template>
          </Button>
          
          <div class="text-center mt-4">
            <button 
              type="button" 
              @click="activeTab = 'signin'" 
              class="text-xs text-primary hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-vue-next';

// Active tab state: 'signin' or 'reset'
const activeTab = ref('signin');

const authStore = useAuthStore();

const signInEmail = ref('');
const signInPassword = ref('');
const signInError = ref<string | null>(null);

const resetEmail = ref('');
const resetError = ref<string | null>(null);
const resetSuccessMessage = ref<string | null>(null);

// Helper to clear errors after a delay
const clearError = (errorRef: Ref<string | null>) => {
  setTimeout(() => {
    errorRef.value = null;
  }, 5000);
};

const clearSuccess = (successRef: Ref<string | null>) => {
  setTimeout(() => {
    successRef.value = null;
  }, 5000);
};

const handleSignIn = async () => {
  signInError.value = null;

  if (!signInEmail.value || !signInPassword.value) { 
    signInError.value = 'Please enter both email and password.';
    clearError(signInError);
    return;
  }
  
  await authStore.signInWithPassword(signInEmail.value, signInPassword.value);

  if (authStore.error) {
    signInError.value = authStore.error.message;
    clearError(signInError);
  } else {
    signInEmail.value = '';
    signInPassword.value = '';
    // Navigation will be handled by the listener in App.vue updating the state
  }
};

const handlePasswordReset = async () => {
  resetError.value = null;
  resetSuccessMessage.value = null;
  
  if (!resetEmail.value) {
    resetError.value = 'Please enter your email address.';
    clearError(resetError);
    return;
  }
  
  await authStore.sendPasswordResetEmail(resetEmail.value);
  
  if (authStore.error) {
    resetError.value = authStore.error.message;
    clearError(resetError);
  } else {
    resetSuccessMessage.value = 'Password reset email sent. Please check your inbox.';
    resetEmail.value = '';
    clearSuccess(resetSuccessMessage);
  }
};
</script> 