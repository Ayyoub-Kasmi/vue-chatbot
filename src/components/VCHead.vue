<template>
    <div id="head" class="w-full h-1/6 px-2 py-1 flex justify-between items-center bg-[#8a2be2]">
        <img src="/vite.svg" alt="bot logo" class="w-10 h-10 bg-gray-400 rounded-full p-1">
        <p class="w-full text-center text-white">{{ title }}</p>
    </div>
</template>

<script setup lang="ts">
    type Props = {
        title: string;
    }

    defineProps<Props>()
</script>

<style scoped>
</style>