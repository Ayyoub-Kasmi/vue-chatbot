<template>
    <div class="h-full w-full overflow-y-scroll flex flex-col gap-4 pt-4 pb-2 px-2 bg-orange-300">
        <Message agent="bot" content="Welcome to ANCAA platform! How can I serve you?"/>
        <Message agent="user" content="Thank you!"/>
        <Message agent="bot" content="Welcome to ANCAA platform! How can I serve you?"/>
        <Message agent="user" content="Thank you!"/>
    </div>
</template>

<script setup lang="ts">
    import Message from './Message.vue'
</script>