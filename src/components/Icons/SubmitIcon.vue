<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 500 500"
  >
    <g>
      <g>
        <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
  type Props = {
    size?: number;
  }

  withDefaults(defineProps<Props>(), {
    size: 20
  })  
</script>