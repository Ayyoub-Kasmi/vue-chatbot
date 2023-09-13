<template>
  <div @click="console.log(user)">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  type Props = {
    user: boolean;
  }

  defineProps<Props>()
</script>

<style scoped>
  div {
    display: flex;
    justify-content: v-bind("user ? 'flex-end' : 'flex-start'");
    align-items: flex-end;
  } 
</style>