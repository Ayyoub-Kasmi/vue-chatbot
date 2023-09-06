<template>
  <input type="text" :style="{
    'border-top': invalid ? '0' : '1px solid #eee',
    'box-shadow': invalid ? 'inset 0 0 2px #E53935' : 'none',
    color: invalid ? '#E53935' : '',
    opacity: disabled && !invalid ? '.5' : '1',
    padding: hasButton ? '16px 52px 16px 10px' : '16px 10px',
  }">
</template>

<script setup lang="ts">
  type Props = {
    invalid: boolean;
    disabled: boolean;
    hasButton: boolean;
    floating: boolean;
  }

  const { invalid, disabled, hasButton, floating } = withDefaults(defineProps<Props>(), {
    invalid: false,
    disabled: false,
    hasButton: true,
    floating: true,
  })

</script>

<style scoped>
  input {
    /* TODO: add the animation for the invalid input */
    border: 0;
    border-radius: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-sizing: border-box;
    
    font-size: 16px;
    
    outline: none;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;

  }

  input:disabled {
    background: #fff;
  }

  /* @media screen and (max-width: 568px) {
    border-bottom-left-radius: ${props => (props.floating ? '0' : '10px')};
    border-bottom-right-radius: ${props => (props.floating ? '0' : '10px')};
  } */
</style>