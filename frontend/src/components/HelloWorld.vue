<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

defineProps<{ msg: string }>()

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<template>
  <div class="flex flex-col items-center space-y-8 py-8 max-w-4xl mx-auto">
    <div class="text-center space-y-2">
      <Badge variant="outline" class="mb-2">Welcome</Badge>
      <h1 class="text-4xl font-bold tracking-tight">{{ msg }}</h1>
      <p class="text-muted-foreground">A beautiful component library for Vue</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <!-- Counter Card -->
      <Card class="shadow-md">
        <CardHeader>
          <CardTitle>Interactive Counter</CardTitle>
          <CardDescription>Click the button to increment the counter</CardDescription>
        </CardHeader>
        <CardContent class="flex items-center justify-center py-6">
          <div class="text-center">
            <div class="text-5xl font-bold mb-4">{{ count }}</div>
            <Button variant="default" size="lg" @click="increment" class="min-w-[150px]">
              Increment
            </Button>
          </div>
        </CardContent>
        <CardFooter class="text-sm text-muted-foreground">
          Using the Shadcn/UI Button component with default styling
        </CardFooter>
      </Card>

      <!-- Info Card -->
      <Card class="shadow-md">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Resources to help you build with Vue</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <h3 class="font-medium">Hot Module Replacement</h3>
            <p class="text-sm text-muted-foreground">
              Edit <code class="bg-muted px-1 py-0.5 rounded">components/HelloWorld.vue</code> to test HMR
            </p>
          </div>
          <div class="space-y-2">
            <h3 class="font-medium">Documentation</h3>
            <p class="text-sm text-muted-foreground">
              Check out the
              <a 
                href="https://vuejs.org/guide/quick-start.html#local" 
                target="_blank" 
                class="text-primary hover:underline"
              >
                Vue docs
              </a> and
              <a 
                href="https://shadcn-vue.com" 
                target="_blank" 
                class="text-primary hover:underline"
              >
                Shadcn Vue
              </a>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" class="w-full">
            Explore Documentation
          </Button>
        </CardFooter>
      </Card>
    </div>
    
    <div class="text-center text-sm text-muted-foreground">
      <p>Click on the Vite and Vue logos above to learn more about each technology</p>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
