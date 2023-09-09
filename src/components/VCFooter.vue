<template>
    <form :onsubmit="handleSubmit" class="h-1/6 px-2 py-2 flex justify-between items-center bg-[#00f]">
        <input type="text" name="message" id="message" placeholder="Enter a message ..."
        class="h-full px-2 rounded-md">
        <button type="submit" class="text-white bg-green-700">Send</button>
    </form>
</template>

<script setup lang="ts">
    const handleSubmit = (e:SubmitEvent) => {
        e.preventDefault();
    }
</script>

<style scoped>
</style>