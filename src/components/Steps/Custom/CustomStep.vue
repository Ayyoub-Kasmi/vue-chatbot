<template>
  <CustomStepContainer class="rsc-cs" :style="style">
    <component :is="loadingState ? Loading : renderComponent().component" v-bind="renderComponent().props"></component>
  </CustomStepContainer>
</template>

<script setup lang="ts">
  import CustomStepContainer from './CustomStepContainer.vue';
  import Loading from '../common/Loading.vue';
  import { ref, onMounted, CSSProperties,  } from 'vue';
  import type Step from 'types/Step'; 

  type Props = {
    previousStep: Step
    previousValue?: string | boolean | null | Object | Array<Object>;
    speak?: Function,
    step: Step;
    steps: Object;
    style: CSSProperties;
    triggerNextStep: Function;
  }
  
  const { speak, step, steps, previousStep, previousValue, triggerNextStep} = withDefaults(defineProps<Props>(), {
    previousValue: '',
    speak: () => {}
  })


  const loadingState = ref(true);

  onMounted(() => {
    const { delay, waitAction} = step;

    setTimeout(() => {
      loadingState.value = false;

      if(!waitAction && !step.rendered) triggerNextStep();

      speak(step, previousValue);
    }, delay);
  })


  const renderComponent = () => {
      const { component:StepComponent } = step;
      return {
        component: StepComponent,
        props: {
          step,
          steps,
          previousStep,
          triggerNextStep,
        }
      }
  };
      
</script>