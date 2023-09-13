<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import defaultTheme from '../theme';
  import type ChatBotTheme from 'types/ChatBotTheme';

  withDefaults(defineProps<{theme?: ChatBotTheme}>(), {
    theme: () => defaultTheme
  })
</script>

<style scoped>
  div {
    align-items: center;
    background: v-bind(theme.headerBgColor);
    color: v-bind(theme.headerFontColor);
    display: flex;
    fill: v-bind(theme.headerFontColor);
    height: 56px;
    justify-content: space-between;
    padding: 0 10px;
  }
</style>