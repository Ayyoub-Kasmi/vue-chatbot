<template>
  <img :width="width" :height="height" :src="src"/>
</template>

<script setup lang="ts">
  type Props = {
    width: number | string;
    height: number | string;
    src: string
  }

  const { width, height, src } = withDefaults(defineProps<Props>(), {
    width: "24px",
    height: "24px",
  })
  
</script>