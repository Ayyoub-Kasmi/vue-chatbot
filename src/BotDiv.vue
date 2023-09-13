<template>
    <div>{{ opened }}</div>
</template>

<script setup lang="ts">
    defineProps<{opened: boolean, disabled: boolean, speaking: boolean, invalid: boolean}>()
</script>