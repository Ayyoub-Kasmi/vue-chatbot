<template>
  <img :src="src" :alt="alt" :style="{
    borderRadius: user ? '50% 50% 50% 0' : '50% 50% 0 50%',
    transformOrigin: user ? 'bottom left' : 'bottom right',
    ...avatarStyle
  }">
</template>

<script setup lang="ts">
  import { CSSProperties } from 'vue'
  type Props = {
    user?: string;
    showAvatar?: boolean;
    avatarStyle?: CSSProperties;
    src: string;
    alt: string;
  }

  withDefaults(defineProps<Props>(), {
    showAvatar: false,
  })

</script>

<style scoped>
  img {
    width: 40px;
    height: 40px;
    animation: scale 0.3s ease forwards;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 2px 0px;
    min-width: 40px;
    padding: 3px;
    transform: scale(0);
  }
</style>