<template>
  <VueChatBot
    title="Vue Chat Bot"
    class="vue-chat-bot"
    :customStyle="{}"
    :controlStyle="{}"
    botAvatar="src/assets/vue.svg"
    :floating="true"
    :opened="false"
    :recognitionEnable="true"
    :hideHeader="false"
    :hideSubmitButton="false"
    :floatingIconProp="'src/assets/vue.svg'"
    :steps="initialSteps"
  />
</template>

<script setup lang="ts">
  import VueChatBot from './components/VueChatBot copy.vue'
  import type Step from "../types/Step.ts"

  const initialSteps = new Map<string, Step>();
  initialSteps.set('here', {
    id: 'here',
    user: false,
    botName: 'Vue Chat Bot',
    avatar: 'src/assets/vue.svg',
    message: 'Hello!',
    asMessage: '',
    value: 'Hello!',
    delay: 1000,
    waitAction: true,
    placeholder: 'doggy',
    hideInput: false,
    hideExtraControl: false,
    update: '',
    trigger: 'there',
    validator: (value:string) => !!value
  })

  initialSteps.set('there', {
    id: 'there',
    user: true,
    botName: 'Vue Chat Bot',
    avatar: 'src/assets/vue.svg',
    message: 'Hi!',
    asMessage: '',
    value: 'Hi!',
    delay: 1000,
    waitAction: true,
    placeholder: 'catty',
    hideInput: false,
    hideExtraControl: false,
    update: '',
    trigger: 'last',
    validator: (value:string) => !!value
  })

  initialSteps.set('last', {
    id: 'last',
    user: false,
    botName: 'Vue Chat Bot',
    avatar: 'src/assets/vue.svg',
    message: 'Hi!',
    asMessage: '',
    value: 'Hi!',
    delay: 1000,
    waitAction: true,
    placeholder: 'catty',
    hideInput: false,
    hideExtraControl: false,
    update: '',
    trigger: 'here',
    validator: (value:string) => !!value
  })
</script>

<style scoped>
</style>