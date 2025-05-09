<template>
  <Card class="w-full max-w-md mx-auto my-8">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl font-bold">Update Password</CardTitle>
      <CardDescription>Enter your new password below.</CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <Alert v-if="updateError" variant="destructive">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Error Updating Password</AlertTitle>
        <AlertDescription>{{ updateError }}</AlertDescription>
      </Alert>

      <Alert v-if="updateSuccessMessage" variant="default" class="bg-green-100 border-green-400 text-green-700">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>{{ updateSuccessMessage }}</AlertDescription>
      </Alert>

      <form @submit.prevent="handleUpdatePassword" class="space-y-4">
        <div class="space-y-2">
          <Label for="new-password">New Password</Label>
          <Input id="new-password" type="password" v-model="newPassword" required />
        </div>
        <div class="space-y-2">
          <Label for="confirm-password">Confirm New Password</Label>
          <Input id="confirm-password" type="password" v-model="confirmPassword" required />
        </div>
        <Button type="submit" :disabled="authStore.loading" size="default" class="w-full">
          {{ authStore.loading ? 'Updating...' : 'Update Password' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-vue-next'; // Icon for alerts

const authStore = useAuthStore();
const router = useRouter();

const newPassword = ref('');
const confirmPassword = ref('');
const updateError = ref<string | null>(null);
const updateSuccessMessage = ref<string | null>(null);

// Helper to clear messages after a delay
const clearMessage = (messageRef: Ref<string | null>) => {
  setTimeout(() => {
    messageRef.value = null;
  }, 5000); // Clear message after 5 seconds
};

const handleUpdatePassword = async () => {
  console.log('[UpdatePasswordPage.vue] handleUpdatePassword triggered');
  updateError.value = null;
  updateSuccessMessage.value = null;

  if (!newPassword.value || !confirmPassword.value) {
    updateError.value = 'Please enter and confirm your new password.';
    clearMessage(updateError);
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    updateError.value = 'Passwords do not match.';
    clearMessage(updateError);
    return;
  }

  console.log('[UpdatePasswordPage.vue] Calling authStore.updatePassword. Loading state:', authStore.loading);
  // Assuming the user is already in a "recovered" state by Supabase after clicking the link
  await authStore.updatePassword(newPassword.value);
  console.log('[UpdatePasswordPage.vue] authStore.updatePassword finished. Loading state:', authStore.loading, 'Error state:', authStore.error);

  if (authStore.error) {
    console.error('[UpdatePasswordPage.vue] Update password error from authStore:', authStore.error.message);
    updateError.value = authStore.error.message;
    clearMessage(updateError);
  } else {
    console.log('[UpdatePasswordPage.vue] Password update successful.');
    updateSuccessMessage.value = 'Password updated successfully! You can now sign in with your new password.';
    newPassword.value = '';
    confirmPassword.value = '';
    clearMessage(updateSuccessMessage);
    // Optionally redirect to login page after a delay
    setTimeout(() => {
      router.push('/auth'); // Or your login route
    }, 3000);
  }
};
</script> 