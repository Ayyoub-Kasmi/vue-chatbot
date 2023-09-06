<template>
  <button :style="{
    cursor: disabled ? 'default' : 'pointer',
    fill: fillFunc(speaking, invalid, theme),
    opacity: disabled && !invalid ? '.5' : '1',
  }"></button>
</template>

<script setup lang="ts">
  import defaultTheme from '@/theme';
import type ChatBotTheme from 'types/ChatBotTheme';

  type Props = {
    disabled: boolean;
    invalid: boolean;
    speaking: boolean;
    theme: ChatBotTheme;
  }

  const { disabled, speaking, invalid, theme} = withDefaults(defineProps<Props>(), {
    disabled: false,
    speaking: false,
    invalid: false,
    theme: () => defaultTheme
  })

  const fillFunc = (speaking:boolean, invalid: boolean, theme: ChatBotTheme): string => {
    if (speaking) {
      return theme.headerBgColor;
    }
    return invalid ? '#E53935' : '#4a4a4a';
  };
</script>

<style scoped>
  bottom {
    background-color: transparent;
    border: 0;
    border-bottom-right-radius: 10px;
    box-shadow: none;
    outline: none;
    padding: 14px 16px 12px 16px;
  }

  button::before {
    content: '';
    position: absolute;
    width: 23px;
    height: 23px;
    border-radius: 50%;
    /* animation: ${({ theme, speaking }) =>
      speaking
        ? css`
            ${pulse(theme.headerBgColor)} 2s ease infinite
          `
        : ''}; */
  }
  button:not(:disabled):hover {
    opacity: 0.7;
  }
</style>