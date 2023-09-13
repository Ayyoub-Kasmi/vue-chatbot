<template>
  <div @click="console.log(floating)" >
      <slot></slot>
    </div>
</template>

<script setup lang='ts'>
  import defaultTheme from '../theme';
  import ChatBotTheme from 'types/ChatBotTheme'

  type Props = {
    theme?: ChatBotTheme;
    floating?: boolean;
    floatingStyle? : {
      top: string;
      bottom: string;
      left: string;
      right: string;
      transformOrigin: string;
    };
    opened?: boolean;
    width?: string;
    height?: string;
  }

  withDefaults(defineProps<Props>(), {
    theme: () => defaultTheme,
    floating: false,
    opened: false,
    floatingStyle: () => {
      return {
        top: 'initial',
        bottom: '32px',
        left: 'initial',
        right: '32px',
        transformOrigin: 'bottom right'
      }
    }
  })

</script>

<style scoped>
  div {
    background: v-bind('theme.background');
    border-radius: 10px;
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.15);
    font-family: v-bind('theme.fontFamily');
    overflow: hidden;
    
    width: v-bind(width);
    height: v-bind(height);
    z-index: 999;
    transition: transform 0.3s ease;

    position: v-bind("floating ? 'fixed' : 'relative'");
    bottom: v-bind("floating ? floatingStyle.bottom : 'initial'");
    top: v-bind("floating ? floatingStyle.top : 'initial'");
    right: v-bind("floating ? floatingStyle.right : 'initial'");
    left: v-bind("floating ? floatingStyle.left : 'initial'");
    transform: v-bind("opened ? 'scale(1)' : 'scale(0)'");
    transform-origin: v-bind("floatingStyle.transformOrigin");
  }

  @media screen and (max-width: 568px) {
    div {
      border-radius: v-bind('floating ? "0" : ""');
      bottom: 0 !important;
      left: initial !important;
      height: 100%;
      right: 0 !important;
      top: initial !important;
      width: 100%;
    }
  }
</style>