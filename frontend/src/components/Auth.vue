<template>
  <Card class="w-full max-w-md mx-auto my-8">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl font-bold">Authentication</CardTitle>
      <CardDescription>Sign in, sign up, or reset your password.</CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- Simple Counter for Debugging -->
      <div class="border p-4 rounded-md">
        <h4 class="text-md font-semibold text-center mb-2">Debug Counter</h4>
        <p class="text-center text-xl mb-2">Count: {{ debugCounter }}</p>
        <Button @click="incrementDebugCounter" variant="outline" size="default" class="w-full">Increment Debug Counter</Button>
      </div>
      <!-- End Simple Counter -->

      <!-- Error Display -->
      <Alert v-if="authStore.error && !signInError && !resetError" variant="destructive">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>{{ authStore.error.message }}</AlertDescription>
      </Alert>

      <!-- Sign In Form -->
      <form @submit.prevent="handleSignIn" class="space-y-4">
        <h3 class="text-lg font-semibold text-center">Sign In</h3>
         <Alert v-if="signInError" variant="destructive">
            <AlertCircle class="w-4 h-4" />
            <AlertTitle>Sign In Error</AlertTitle>
            <AlertDescription>{{ signInError }}</AlertDescription>
         </Alert>
        <div class="space-y-2">
          <Label for="signin-email">Email</Label>
          <Input id="signin-email" type="email" placeholder="you@example.com" v-model="signInEmail" required />
        </div>
        <div class="space-y-2">
          <Label for="signin-password">Password</Label>
          <Input id="signin-password" type="password" v-model="signInPassword" required />
        </div>
        <Button type="submit" @click="handleSignIn" :disabled="authStore.loading" size="default" class="w-full">
          {{ authStore.loading ? 'Signing In...' : 'Sign In' }}
        </Button>
      </form>

      <Separator />

      <!-- Password Reset Form -->
      <form @submit.prevent="handlePasswordReset" class="space-y-4">
        <h3 class="text-lg font-semibold text-center">Reset Password</h3>
         <Alert v-if="resetError" variant="destructive">
            <AlertCircle class="w-4 h-4" />
            <AlertTitle>Password Reset Error</AlertTitle>
            <AlertDescription>{{ resetError }}</AlertDescription>
          </Alert>
         <div v-if="resetSuccessMessage" class="text-green-600 text-center">
            {{ resetSuccessMessage }}
         </div>
        <div class="space-y-2">
          <Label for="reset-email">Email</Label>
          <Input id="reset-email" type="email" placeholder="you@example.com" v-model="resetEmail" required />
        </div>
        <Button type="submit" @click="handlePasswordReset" :disabled="authStore.loading" size="default" class="w-full">
          {{ authStore.loading ? 'Sending...' : 'Send Password Reset Email' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-vue-next'; // Icon for alerts

const debugCounter = ref(0);
const incrementDebugCounter = () => {
  debugCounter.value++;
  console.log('[Auth.vue] Debug counter incremented. New value:', debugCounter.value);
};

const authStore = useAuthStore();
console.log('[Auth.vue] Initializing component, initial authStore.loading:', authStore.loading);

const signInEmail = ref('');
const signInPassword = ref('');
const signInError = ref<string | null>(null);

// Removing Sign Up related refs
// const signUpEmail = ref('');
// const signUpPassword = ref('');
// const signUpError = ref<string | null>(null);
// const signUpSuccessMessage = ref<string | null>(null);

const resetEmail = ref('');
const resetError = ref<string | null>(null);
const resetSuccessMessage = ref<string | null>(null);


// Helper to clear errors after a delay
const clearError = (errorRef: Ref<string | null>) => {
  setTimeout(() => {
    errorRef.value = null;
  }, 5000); // Clear error after 5 seconds
};
const clearSuccess = (successRef: Ref<string | null>) => {
  setTimeout(() => {
    successRef.value = null;
  }, 5000); // Clear success message after 5 seconds
};


const handleSignIn = async () => {
  console.log('[Auth.vue] handleSignIn triggered');
  signInError.value = null;

  // --- Remove TEMPORARY HARDCODING FOR TESTING ---
  // const testEmail = 'test@test.be';
  // const testPassword = 'test';
  // console.log(`[Auth.vue] HARDCODED TEST: Email: ${testEmail}, Password: ${testPassword}`);
  // --- END TEMPORARY HARDCODING ---

  // --- Restore Original validation logic ---
  if (!signInEmail.value || !signInPassword.value) { 
    console.log('[Auth.vue] SignIn validation failed: Email or password empty.');
    signInError.value = 'Please enter both email and password.';
    clearError(signInError);
    return;
  }
  

  console.log('[Auth.vue] Calling authStore.signInWithPassword. Loading state:', authStore.loading);
  // --- Use values from input fields again ---
  await authStore.signInWithPassword(signInEmail.value, signInPassword.value);

  console.log('[Auth.vue] authStore.signInWithPassword finished. Loading state:', authStore.loading, 'Error state:', authStore.error);
  if (authStore.error) {
    console.error('[Auth.vue] SignIn error from authStore:', authStore.error.message);
    signInError.value = authStore.error.message;
    clearError(signInError);
  } else {
    console.log('[Auth.vue] SignIn successful. Clearing form.');
    signInEmail.value = '';
    signInPassword.value = '';
    // Navigation will be handled by the listener in App.vue updating the state
  }
};

// Removing handleSignUp function
// const handleSignUp = async () => {
//   console.log('[Auth.vue] handleSignUp triggered');
//   signUpError.value = null;
//   signUpSuccessMessage.value = null;

//   console.log('[Auth.vue] Email:', signUpEmail.value, 'Password:', signUpPassword.value);

//   if (!signUpEmail.value || !signUpPassword.value) {
//     console.log('[Auth.vue] SignUp validation failed: Email or password empty.');
//     signUpError.value = 'Please enter both email and password.';
//     clearError(signUpError);
//     return;
//   }

//   console.log('[Auth.vue] Calling authStore.signUpWithPassword. Loading state:', authStore.loading);
//   await authStore.signUpWithPassword(signUpEmail.value, signUpPassword.value);
//   console.log('[Auth.vue] authStore.signUpWithPassword finished. Loading state:', authStore.loading, 'Error state:', authStore.error);

//   if (authStore.error) {
//     console.error('[Auth.vue] SignUp error from authStore:', authStore.error.message);
//     signUpError.value = authStore.error.message;
//     clearError(signUpError);
//   } else {
//     console.log('[Auth.vue] SignUp successful. Clearing form.');
//     signUpEmail.value = '';
//     signUpPassword.value = '';
//     signUpSuccessMessage.value = 'Sign up successful! Please check your email to confirm your account.';
//     clearSuccess(signUpSuccessMessage);
//   }
// };

const handlePasswordReset = async () => {
  console.log('[Auth.vue] handlePasswordReset triggered');
  resetError.value = null;
  resetSuccessMessage.value = null;
  if (!resetEmail.value) {
    console.log('[Auth.vue] Reset validation failed: Email empty.');
    resetError.value = 'Please enter your email address.';
    clearError(resetError);
    return;
  }
  console.log('[Auth.vue] Calling authStore.sendPasswordResetEmail. Loading state:', authStore.loading);
  await authStore.sendPasswordResetEmail(resetEmail.value);
  console.log('[Auth.vue] authStore.sendPasswordResetEmail finished. Loading state:', authStore.loading, 'Error state:', authStore.error);
  if (authStore.error) {
    console.error('[Auth.vue] Reset error from authStore:', authStore.error.message);
    resetError.value = authStore.error.message;
    clearError(resetError);
  } else {
    console.log('[Auth.vue] Reset email sent. Clearing form.');
    resetSuccessMessage.value = 'Password reset email sent. Please check your inbox.';
    resetEmail.value = '';
    clearSuccess(resetSuccessMessage);
  }
};
</script> 