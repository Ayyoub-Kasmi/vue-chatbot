<template>
  <span></span>
</template>

<script setup lang="ts">
  type Props = {
    delay: string;
  }

  defineProps<Props>();
</script>

<style scoped>
  span {
    animation: loading 1.4s infinite both;
    animation-delay: v-bind(delay);
  }
</style>