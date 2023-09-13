<template>
  <div :style="{
    backgroundColor: user ? theme.userBubbleColor : theme.botBubbleColor,
    borderRadius: getBorderRaduis(),
    margin: getMargin(),
    color: user ? theme.userFontColor : theme.botFontColor,
    transformOrigin: getTransformOrigin(),
  }">
    <slot></slot>
  </div>
</template>

<script setup lang="tsx">
  import type ChatBotTheme from "types/ChatBotTheme.ts" 
  import defaultTheme from '../../../theme.ts';

  type Props = {
    user?: string;
    isFirst: boolean;
    isLast: boolean;
    showAvatar: boolean;
    theme?: ChatBotTheme;
  }

  const {user, isFirst, isLast, showAvatar} = withDefaults(defineProps<Props>(), {
    theme: () => defaultTheme
  })
  
  const getBorderRaduis = ():string => {
  
    if (!isFirst && !isLast) {
      return user ? '18px 0 0 18px' : '0 18px 18px 0px';
    }
  
    if (!isFirst && isLast) {
      return user ? '18px 0 18px 18px' : '0 18px 18px 18px';
    }
  
    return user ? '18px 18px 0 18px' : '18px 18px 18px 0';
  }

  const getMargin = ():string => {
    
    if (!isFirst && showAvatar) {
      return user ? '-8px 46px 10px 0' : '-8px 0 10px 46px';
    }
  
    if (!isFirst && !showAvatar) {
      return user ? '-8px 0px 10px 0' : '-8px 0 10px 0px';
    }
  
    return '0 0 10px 0';
  }
  
  const getTransformOrigin = ():string => {
    if (isFirst) {
      return user ? 'bottom right' : 'bottom left';
    }
  
    return user ? 'top right' : 'top left';

  }

</script>

<style scoped>
  div {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
    display: inline-block;
    font-size: 14px;
    max-width: 50%;
    overflow: hidden;
    position: relative;
    padding: 12px;
    transform: scale(0);
    animation: scale 0.3s ease forwards;
  }

  @keyframes scale {
    100% { 
      transform: scale(1); 
    }
  }
</style>