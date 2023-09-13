<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { CSSProperties } from 'vue';

  type Props = {
    class: string;
    style?: CSSProperties;
    theme?: {
      headerBgColor?: string;
      headerFontColor?: string;
    },
    opened: boolean;
  }

  withDefaults(defineProps<Props>(), {
    theme: () => {
      return {
        headerBgColor: "#6E48AA",
        headerFontColor: "#FFF"
      }
    },
  })

</script>

<style scoped>
  div {
    align-items: center;
    cursor: pointer;
    background: v-bind('theme.headerBgColor');
    bottom: 32px;
    border-radius: 100%;
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.15);
    display: flex;
    fill: v-bind('theme.headerFontColor');
    height: 56px;
    justify-content: center;
    position: fixed;
    right: 32px;
    transform: v-bind("opened ? 'scale(0)' : 'scale(1)'");
    transition: transform 0.3s ease;
    width: 56px;
    z-index: 999;
  }
</style>