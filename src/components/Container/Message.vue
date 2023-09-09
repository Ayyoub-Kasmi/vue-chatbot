<template>
    <div :class="`w-full flex ${agent === 'bot' ? ' flex-row' : ' flex-row-reverse'} gap-2`">
        <img :src="agent === 'bot' ? '/vite.svg' : ''" alt="logo" class="w-10 h-10 p-1 rounded-full bg-gray-400">
        <div class="w-fit max-w-[80%] text-ellipsis p-2 bg-gray-400 rounded-md"> {{ content }}</div>
    </div>
</template>

<script setup lang="ts">
    type Props = {
        agent: 'bot' | 'user';
        content: string;
    }

    defineProps<Props>();
</script>