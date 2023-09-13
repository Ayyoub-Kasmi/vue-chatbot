
<script setup lang="tsx">
  import Step, { StepOption } from 'types/Step';
  import Option from './Option.vue';
  import OptionElement from './OptionElement.vue';
  import Options from './Options.vue';
  import OptionsStepContainer from './OptionsStepContainer.vue';
  import { CSSProperties, h } from 'vue';

  type Props = {
    bubbleOptionStyle: CSSProperties;
    step: Step,
    previousValue?: string;
    triggerNextStep: Function;
  };

  const { bubbleOptionStyle, step, triggerNextStep } = defineProps<Props>();

  const { options } = step;

  const onOptionClick = ( value:string ) => {

    triggerNextStep( value );
  };

  

  const renderOption = (option:StepOption) => {
    const { user } = step;
    const { value, label } = option;

    return <Option key={value} class={"rsc-os-option"}>
      <OptionElement class={"rsc-os-option-element"} style={bubbleOptionStyle} user={user}>

      </OptionElement>
    </Option>

    return h(
      'Option',
      {key: value, class: 'rsc-rsc-os-option'},
      [h('OptionElement', {class: 'rsc-os-option-element', style: bubbleOptionStyle, user: user, onClick: ()=>onOptionClick(value)}, label)]
    )
    // <Option key={value} class="rsc-os-option">
    //     <OptionElement
    //       class="rsc-os-option-element"
    //       v-bind:style="bubbleOptionStyle"
    //       v-bind:user="user"
    //       onclick={() => onOptionClick( value )}
    //     >
    //       {{label}}
    //     </OptionElement>
    //   </Option>
    
  };

</script>

<template>
      <OptionsStepContainer className="rsc-os">
        <Options className="rsc-os-options">
          {{options?.map(renderOption)}}
        </Options>
      </OptionsStepContainer>
</template>