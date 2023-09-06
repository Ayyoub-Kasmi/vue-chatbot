<template>
  <div :style="{
      position: floating ? 'fixed' : 'relative',
      bottom: floating ? floatingStyle.bottom || '32px' : 'initial',
      top: floating ? floatingStyle.top || 'initial' : 'initial',
      right: floating ? floatingStyle.right || '32px' : 'initial',
      left: floating ? floatingStyle.left || 'initial' : 'initial',
      transform: opened ? 'scale(1)' : 'scale(0)',
      'transform-origin': floatingStyle.transformOrigin || 'bottom right',
    }"></div>
</template>

<script setup lang='ts'>
import defaultTheme from '../theme';
import ChatBotTheme from 'types/ChatBotTheme'

type Props = {
  theme: ChatBotTheme;
  floating: boolean;
  floatingStyle : {
    top: number | string | 'initial'
    bottom: number | string | 'initial'
    left: number | string | 'initial'
    right: number | string | 'initial'
    transformOrigin: string | 'bottom right'
  };
  opened: boolean
}

const { theme, floating, floatingStyle, opened } = withDefaults(defineProps<Props>(), {
  theme: () => defaultTheme,
  floating: false,
  opened: false,
})

</script>

<style scoped>
  div {
    background: v-bind(theme.background);
    border-radius: 10px;
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.15);
    font-family: v-bind(theme.fontFamily);
    overflow: hidden;
    
    width: v-bind(theme.width);
    height: v-bind(theme.height);
    z-index: 999;
    transition: transform 0.3s ease;
  }

  @media screen and (max-width: 568px) {
    div {
      /* border-radius: ${({ floating }) => (floating ? '0' : '')}; */
      bottom: 0 !important;
      left: initial !important;
      height: 100%;
      right: 0 !important;
      top: initial !important;
      width: 100%;
    }
  }
</style>