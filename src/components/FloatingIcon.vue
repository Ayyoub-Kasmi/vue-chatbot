<template>
  <img :src="src"/>
</template>

<script setup lang="ts">
  type Props = {
    width?: number | string ;
    height?: number | string;
    src: string
  }

  withDefaults(defineProps<Props>(), {
    width: "24px",
    height: "24px",
  })
</script>

<style scoped>
  img {
    width: v-bind('width');
    height: v-bind('height');
  }
</style>