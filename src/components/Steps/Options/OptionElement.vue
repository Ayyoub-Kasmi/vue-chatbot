<template>
  <button type="button"></button>
</template>

<script setup lang="ts">
  import defaultTheme from '../../../theme';
  import type ChatBotTheme from 'types/ChatBotTheme';

  type Props = {
    user?: boolean;
    theme?: ChatBotTheme;
  }

  withDefaults(defineProps<Props>(), {
    theme: () => defaultTheme
  })

</script>

<style scoped>
  bottom {
    /* background: v-bind(theme.botBubbleColor); */
    border: 0;
    border-radius: 22px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
    /* color: v-bind(theme.botFontColor); */
    display: inline-block;
    font-size: 14px;
    padding: 12px;
  }

  button:hover {
    opacity: 0.7;
  }
  
  button:active, bottom:hover:focus {
    outline: none;
  }
</style>