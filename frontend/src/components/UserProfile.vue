<template>
  <Card class="w-full max-w-lg mx-auto my-8">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl font-bold">User Profile</CardTitle>
      <CardDescription>Manage your profile and security settings.</CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- User Info Section -->
      <div v-if="authStore.user" class="space-y-2 border p-4 rounded-md">
        <h3 class="font-semibold text-lg mb-2">Account Details</h3>
        <p><strong class="font-medium">Email:</strong> {{ authStore.user.email }}</p>
        <p><strong class="font-medium">User ID:</strong> {{ authStore.user.id }}</p>
        <p><strong class="font-medium">Last Sign In:</strong> {{ authStore.user.last_sign_in_at ? new Date(authStore.user.last_sign_in_at).toLocaleString() : 'N/A' }}</p>
      </div>
      <div v-else>
        <Alert variant="destructive">
          <AlertCircle class="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No user data available. Please sign in.</AlertDescription>
        </Alert>
      </div>

      <Separator />

      <!-- Actions Section -->
      <div v-if="authStore.isAuthenticated" class="space-y-6">
        <!-- Update Password Form -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Update Password</h3>
          <form @submit.prevent="handleUpdatePassword" class="space-y-4">
            <div class="space-y-2">
              <Label for="new-password">New Password</Label>
              <Input id="new-password" type="password" v-model="newPassword" required />
            </div>
            <Button type="submit" variant="default" :disabled="authStore.loading" class="w-full !bg-blue-600 text-white shadow-xs !hover:bg-blue-700">
              {{ authStore.loading ? 'Updating...' : 'Update Password' }}
            </Button>
          </form>
           <!-- Update Status Messages -->
          <Alert v-if="updateStatusMessage && updateStatusType === 'success'" variant="default" class="mt-4 bg-green-100 border-green-300 text-green-800">
             <CheckCircle class="w-4 h-4" />
             <AlertTitle>Success</AlertTitle>
             <AlertDescription>{{ updateStatusMessage }}</AlertDescription>
          </Alert>
          <Alert v-if="updateStatusMessage && updateStatusType === 'error'" variant="destructive" class="mt-4">
             <AlertCircle class="w-4 h-4" />
             <AlertTitle>Error Updating Password</AlertTitle>
             <AlertDescription>{{ updateStatusMessage }}</AlertDescription>
          </Alert>
          <!-- General Auth Store Error -->
           <Alert v-if="authStore.error && !updateStatusMessage" variant="destructive" class="mt-4">
             <AlertCircle class="w-4 h-4" />
             <AlertTitle>Authentication Error</AlertTitle>
             <AlertDescription>{{ authStore.error.message }}</AlertDescription>
           </Alert>
        </div>

        <Separator />

        <!-- Sign Out -->
        <div>
           <h3 class="text-lg font-semibold mb-3">Sign Out</h3>
           <Button @click="handleSignOut" :disabled="authStore.loading" class="w-full bg-red-600 text-white hover:bg-red-700">
             {{ authStore.loading ? 'Signing Out...' : 'Sign Out' }}
           </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import type { AuthError } from '@supabase/supabase-js'; // Import AuthError type if not already
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-vue-next'; // Icons for alerts

const authStore = useAuthStore();
const newPassword = ref('');
const updateStatusMessage = ref('');
const updateStatusType = ref(''); // 'success' or 'error'

// Helper to clear local status messages after a delay
const clearStatus = () => {
  setTimeout(() => {
    updateStatusMessage.value = '';
    updateStatusType.value = '';
  }, 5000); // Clear messages after 5 seconds
};

const handleSignOut = async () => {
  await authStore.signOut();
  // Navigation will be handled by App.vue reacting to isAuthenticated change
};

const handleUpdatePassword = async () => {
  if (!newPassword.value) {
    updateStatusMessage.value = 'Please enter a new password.';
    updateStatusType.value = 'error';
    clearStatus();
    return;
  }
  updateStatusMessage.value = '';
  updateStatusType.value = '';
  authStore.error = null; // Clear previous store error before new action

  await authStore.updatePassword(newPassword.value);

  const error = authStore.error; // Assign to local variable

  if (error) {
    // Check if it's likely an AuthError or a generic Error with a message
    if (typeof error === 'object' && error !== null && 'message' in error) {
       // Explicitly assert the type if needed, though `in` operator often suffices
       const errorMessage = (error as AuthError | Error).message;
       updateStatusMessage.value = errorMessage;
    } else {
       updateStatusMessage.value = 'An unknown error occurred during password update.';
       console.error("Password update error object:", error);
    }
     updateStatusType.value = 'error';
  } else {
    updateStatusMessage.value = 'Password updated successfully!';
    updateStatusType.value = 'success';
    newPassword.value = '';
  }
  clearStatus(); // Clear local status message after delay
};
</script> 