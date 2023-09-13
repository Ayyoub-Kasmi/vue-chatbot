<template>
      <TextStepContainer :class="`vcb-ts ${step.user ? 'vcb-ts-user' : 'vcb-ts-bot'}`" :user="step.user">
        <ImageContainer className="vcb-ts-image-container" :user="step.user">
          
          <Image
            v-if="isFirst && showAvatar"
            className="vcb-ts-image"
            :style="avatarStyle"
            :showAvatar="showAvatar"
            :user="step.user"
            :src="step.avatar"
            :alt="step.user ? 'Your avatar' : `${step.botName}'s avatar'`"
          />
          
        </ImageContainer>

        <Bubble
          className="rsc-ts-bubble"
          :style="bubbleStyle"
          :user="step.user"
          :showAvatar="showAvatar"
          :isFirst="isFirst"
          :isLast="isLast"
        >
          <span v-if="typeof renderMessage() === 'string'" >{{ renderMessage() }}</span>
          <component v-else :is="loadingState ? Loading : renderMessage().component" v-bind="renderMessage().props"></component>
        </Bubble>
      </TextStepContainer>

</template>

<script setup lang="ts">

  import type Step from "types/Step.ts"
  import Bubble from './Bubble.vue';
  import Image from './Image.vue';
  import ImageContainer from './ImageContainer.vue';
  import Loading from '../common/Loading.vue';
  import TextStepContainer from './TextStepContainer.vue';
  import { CSSProperties, onMounted, ref } from 'vue';

  type Props = {
    avatarStyle: CSSProperties;
    isFirst: boolean;
    isLast: boolean;
    bubbleStyle: CSSProperties;
    hideBotAvatar: boolean;
    hideUserAvatar: boolean;
    previousStep?: Step
    previousValue?: string | boolean | number | Object | Object[]
    speak?: Function;
    scrollToBottom?: Function;
    step: Step;
    steps?: Step | {};
    triggerNextStep: Function;
    speechSynthesis?: {
      enable: boolean;
      lang: string;
      voice: SpeechSynthesis | any;
    }
  }

  const {step, steps, speak, previousStep, previousValue, scrollToBottom, triggerNextStep, hideUserAvatar, hideBotAvatar} = withDefaults(defineProps<Props>(), {
    previousStep: () => {return {} as Step},
    previousValue: '',
    speak: () => {},
    steps: () => {return {}}
  })
  
  const showAvatar = step.user ? !hideUserAvatar : !hideBotAvatar;

  const loadingState = ref<boolean>(true);

  const getMessage = ():string => {
    const { message } = step;

    if(typeof message === 'string') return message ? message.replace(/{previousValue}/g, previousValue as string) : '';
    
    return '';
  };

  const renderMessage = () => {
    const { component:StepComponent } = step;

    if (StepComponent) {
      return {
        component: StepComponent,
        props: {
          step,
          steps,
          previousStep,
          triggerNextStep,
        }
      }
    }

    return getMessage();
  };

  onMounted(()=>{
    const { component, delay, waitAction} = step;
    const isComponentWatingUser = component && waitAction;

    if(scrollToBottom) scrollToBottom();
    
    setTimeout(() => {
      loadingState.value = false;
      
      if (!isComponentWatingUser && !step.rendered) {
        triggerNextStep();
      }
      
      speak(step, previousValue);

    }, delay);
  })

</script>