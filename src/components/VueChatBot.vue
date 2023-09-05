<template>
    <div>{{ title }}</div>
</template>

<script setup lang="ts">
    defineProps<{title: string}>();
</script>

<style scoped>
    div {
        color: red;
    }
</style>