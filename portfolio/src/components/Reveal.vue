<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'

const props = withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })

const { attach } = useReveal()
</script>

<template>
  <div
    :ref="attach"
    class="reveal"
    :style="props.delay ? { transitionDelay: `${props.delay}ms` } : undefined"
  >
    <slot />
  </div>
</template>
