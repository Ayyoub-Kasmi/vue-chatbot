<template>
    <div class="group w-6 h-6 fixed buttom-20 right-5 p-2 flex items-end justify-end rounded-full">
        <!-- Main -->
        <div class="text-white w-10 h-10 shadow-xl flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 z-50 absolute">
            <img src="/vite.svg" alt="floating button" @click="chatBotOpened = !chatBotOpened" class="w-6 h-6 cursor-pointer transition-all duration-[0.6s]" :class="`${chatBotOpened ? 'rotate-90' : ''}`">
        </div>
        <div class="w-64 h-96 absolute flex flex-col justify-between rounded-lg transition-all duration-[0.2s] ease-out scale-y-0  scale-100 bg-cyan-300"
        :class="`${chatBotOpened ? 'group-hover:scale-100 -translate-x-16 scale-y-100' : 'scale-y-0'}`">
            <slot></slot>
        </div>
    </div>

</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const chatBotOpened = ref<boolean>(false);

</script>