<template>
    <floating-button>
        <vc-head :title="title"/>
        <vc-container/>
        <vc-footer/>
    </floating-button>
    
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import VCHead from './VCHead.vue'
    import VCContainer from './Container/index.vue'
    import VCFooter from './VCFooter.vue'
    import FloatingButton from './FloatingButton.vue'
    
    defineProps<{title: string}>();

    defineOptions({
        components: {
            'vc-head': VCHead,
            'vc-container': VCContainer,
            'vc-footer': VCFooter,
            'floating-button': FloatingButton,
        }
    })
</script>

<style scoped>
</style>