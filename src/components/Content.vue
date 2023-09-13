<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue';

  type Props = {
    height: string | number;
    floating?: boolean;
    style?: CSSProperties;
    hideInput?: boolean;
  }

  defineProps<Props>();
</script>

<style scoped>
  div {
    height: v-bind("`calc(${height} - ${hideInput ? '56px' : '112px'})`");
    overflow-y: scroll;
    margin-top: 2px;
    padding-top: 6px;
  }
</style>