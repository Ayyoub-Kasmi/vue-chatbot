<template>
  <span class="rsc-loading">
    <LoadingStep v-for="delay in delays" :delay="delay">.</LoadingStep>
  </span>
</template>

<script setup lang="ts">
  import LoadingStep from './LoadingStep.vue';

  const delays = ["0s", ".2s", ".4s"];
</script>