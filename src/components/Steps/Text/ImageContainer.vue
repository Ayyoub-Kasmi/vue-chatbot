<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  type Props = {
    user?: boolean;
  }

  defineProps<Props>();
</script>

<style scoped>
  div {
    display: inline-block;
    order: v-bind('user ? "1" : "0"');
    padding: 6px;
  }
</style>