<template>
    <div :className="'rsc' + className">    
        
        <FloatButton
            v-if="floating"
            classname="rsc-float-button"
            :style="floatingStyle"
            :opened="opened"
            @click="toggleChatBot(true)"
        >
            <FloatingIcon v-if="typeof floatingIconSrc !== 'undefined'" :src="floatingIconSrc"/>

            <FloatingIcon v-else-if="typeof FloatingIconProp === 'undefined'" src="floatingIconSrc"/>
            
            <FloatingIconProp v-else/>

        </FloatButton>
        
        <ChatBotContainer
          className="rsc-container"
          :floating="floating"
          :floatingStyle="floatingStyle"
          :opened="opened"
          :style="containerStyle"
          :width="width"
          :height="height"
        >
          {!hideHeader && header}
          <Content
            className="rsc-content"
            ref="setContentRef"
            :height="height"
            :floating="floating"
            :style="contentStyle"
            :hideInput="currentStep.hideInput"
          >
            {{ renderedSteps.map(renderStep) }}
          </Content>

          <Footer className="rsc-footer" style={footerStyle}>
           
            <Input
            v-if="!currentStep.hideInput"
            type="textarea"
            :style="inputStyle"
            ref="this.setInputRef"
            className="rsc-input"
            :placeholder="inputInvalid ? '' : inputPlaceholder"
            :onKeyPress="this.handleKeyPress"
            :onChange="this.onValueChange"
            :value="inputValue"
            :floating="floating"
            :invalid="inputInvalid"
            :disabled="disabled"
            :hasButton="!hideSubmitButton"
            v-bind="inputAttributesOverride"
            />
            
            <div :style="controlStyle" className="rsc-controls">
              {!currentStep.hideInput && !currentStep.hideExtraControl && customControl}
              {!currentStep.hideInput && !hideSubmitButton && (
                <SubmitButton
                  className="rsc-submit-button"
                  :style="submitButtonStyle"
                  :onClick="this.handleSubmitButton"
                  :invalid="inputInvalid"
                  :disabled="disabled"
                  :speaking="speaking"
                >
                  {{icon}}
                </SubmitButton>
              )}
            </div>
          </Footer>
        </ChatBotContainer>
      </div>
</template>

<script setup lang="ts">
    import FloatingIcon from './FloatingIcon.vue'
    import type { CSSProperties } from 'vue'
    type FloatingIconComponent = InstanceType<typeof FloatingIcon>

    type Props = {
        title?: string;
        className?: string;
        floating: boolean;
        floatingIconSrc?: string;
        FloatingIconProp?: FloatingIconComponent;
        floatingStyle: CSSProperties;
        containerStyle: CSSProperties;
        width: number | string;
        height: number | string;
        contentStyle: CSSProperties;
        opened?: boolean;
        toggleFloating?: Function;
    }

    const { title, className, floating, FloatingIconProp, floatingStyle, opened, toggleFloating } = withDefaults(defineProps<Props>(), {
        title: "Vue Chat Bot",
        opened: false,
    })

    const setContentRef = ref(null);
    const setInputRef = ref(null);
    const isChatBotOpen = ref(opened);
    const currentStep = ref({});

    const toggleChatBot = (opened:boolean):void => {
        if (toggleFloating) {
            toggleFloating({ opened });
        } else {
            isChatBotOpen.current = !isChatBotOpen.current;
        }
    };
</script>

<style scoped>
    div {
        color: red;
    }
</style>