<script setup lang="ts">
import { 
  StethoscopeIcon, 
  HeartPulseIcon, 
  PillIcon, 
  ActivityIcon, 
  BrainIcon, 
  FlaskConicalIcon,
  ClipboardIcon,
  UserIcon,
  BarChartIcon,
  ThermometerIcon,
  ZapIcon,
  DumbbellIcon,
  TimerIcon,
  PersonStandingIcon
} from 'lucide-vue-next';

// Define props for customization
defineProps<{
  name: 'stethoscope' | 'heart' | 'pill' | 'activity' | 'brain' | 'lab' | 'clipboard' | 'patient' | 'chart' | 'thermometer' | 'emg' | 'muscle' | 'timer' | 'rehab';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}>();

// Computed size classes based on the size prop
const sizeClass = (size: string | undefined) => {
  switch (size) {
    case 'sm': return 'w-4 h-4';
    case 'md': return 'w-6 h-6';
    case 'lg': return 'w-8 h-8';
    case 'xl': return 'w-12 h-12';
    default: return 'w-6 h-6';
  }
};
</script>

<template>
  <!-- Dynamically display the appropriate icon based on the name prop -->
  <StethoscopeIcon v-if="name === 'stethoscope'" :class="[sizeClass(size), color || 'text-primary']" />
  <HeartPulseIcon v-else-if="name === 'heart'" :class="[sizeClass(size), color || 'text-primary']" />
  <PillIcon v-else-if="name === 'pill'" :class="[sizeClass(size), color || 'text-primary']" />
  <ActivityIcon v-else-if="name === 'activity'" :class="[sizeClass(size), color || 'text-primary']" />
  <BrainIcon v-else-if="name === 'brain'" :class="[sizeClass(size), color || 'text-primary']" />
  <FlaskConicalIcon v-else-if="name === 'lab'" :class="[sizeClass(size), color || 'text-primary']" />
  <ClipboardIcon v-else-if="name === 'clipboard'" :class="[sizeClass(size), color || 'text-primary']" />
  <UserIcon v-else-if="name === 'patient'" :class="[sizeClass(size), color || 'text-primary']" />
  <BarChartIcon v-else-if="name === 'chart'" :class="[sizeClass(size), color || 'text-primary']" />
  <ThermometerIcon v-else-if="name === 'thermometer'" :class="[sizeClass(size), color || 'text-primary']" />
  <!-- Added EMG and rehabilitation related icons -->
  <ZapIcon v-else-if="name === 'emg'" :class="[sizeClass(size), color || 'text-primary']" />
  <DumbbellIcon v-else-if="name === 'muscle'" :class="[sizeClass(size), color || 'text-primary']" />
  <TimerIcon v-else-if="name === 'timer'" :class="[sizeClass(size), color || 'text-primary']" />
  <PersonStandingIcon v-else-if="name === 'rehab'" :class="[sizeClass(size), color || 'text-primary']" />
</template> 