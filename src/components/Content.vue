<template>
  <div :style="style">
  </div>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue';

  type Props = {
    height: number;
    floating: boolean;
    style?: CSSProperties;
    hideInput?: boolean;
  }

  defineProps<Props>();
</script>

<style scoped>
  div {
    /* height: calc(); */
    overflow-y: scroll;
    margin-top: 2px;
    padding-top: 6px;
  }
</style>