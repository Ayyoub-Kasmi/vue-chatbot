<template>
  <h2>
    <slot></slot>
  </h2>
</template>

<script setup lang="ts">
  import defaultTheme from '../theme';
  import type ChatBotTheme from 'types/ChatBotTheme';

  withDefaults(defineProps<{theme?: ChatBotTheme}>(), {
    theme: () => defaultTheme,
  })
</script>

<style scoped>
  h2 {
    margin: 0;
    font-size: v-bind(theme.headerFontSize);
  }
</style>