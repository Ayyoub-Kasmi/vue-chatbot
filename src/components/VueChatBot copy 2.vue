<template>
  <div class="vcb">
    
    <FloatButton
      v-if="floating" 
      class="vcb-float-button"
      :style="floatingStyle"
      :theme="{headerBgColor: 'red'}"
      :opened="isOpened"
      @click="toggleChatBot(true)"
    >
      <FloatingIcon v-if="(typeof floatingIconProp) === 'string'" :src="(floatingIconProp as string)"/>
      <component v-else :is="floatingIconProp as DefineComponent"/>
    </FloatButton>

    <BotDiv :opened="isOpened" @click="console.log('hii')" :disabled="disabled" :speaking="speaking" :invalid="inputInvalid"/>
    
    <ChatBotContainer
      class="vcb-container"
      :floating="floating"
      :floatingStyle="floatingStyle"
      :opened="isOpened"
      :style="style"
      :width="width"
      :height="height"
      >
      <template v-if="!hideHeader">
        <Header v-if="!HeaderComponent">
          <HeaderTitle class="vcb-header-title">{{ headerTitle }}</HeaderTitle>
          <HeaderIcon v-if="floating" class="vcb-header-close-button">
            <CloseIcon @click="toggleChatBot(false)"/>
          </HeaderIcon>
        </Header>
        <HeaderComponent :toggleFloating="toggleFloating" v-else />
      </template>

      <Content
        v-if="!hideHeader"
        class="vcb-content"
        :ref="(node: InstanceType<typeof Content>) => {contentRef = node?.$el}"
        :floating="floating"
        :style="contentStyle"
        :height="height"
        :hideInput="currentStep?.hideInput"
      >
        <template v-for="step in renderSteps()" :key="step.id" >
          <component :is="step.component" v-bind="step.props"></component>
        </template>
      </Content>

      <Footer class="vcb-footer" :style="footerStyle">
        <VueChatBotInput
          v-if="!currentStep?.hideInput"
          type="textarea"
          class="rsc-input"
          
          :style="inputStyle"
          :ref="(node: InstanceType<typeof VueChatBotInput>) => {input = node?.$el}"
          :placeholder="inputInvalid ? '' : inputPlaceholder"
          @input="onValueChange"
          @keypress="handleKeyPress"
          :value="inputValue"
          :floating="floating"
          :invalid="inputInvalid"
          :disabled="disabled"
          :hasButton="!hideSubmitButton"
          v-bind="inputAttributesOverride"
        />
        
        <div :style="controlStyle" class="vcb-controls">
          <ExtraControl v-if="!currentStep?.hideInput && !currentStep?.hideExtraControl && ExtraControl" :disabled="disabled" :speaking="speaking" :invalid="inputInvalid" />
          
          <SubmitButton
            v-if="!currentStep?.hideInput && !hideSubmitButton"
            class="rsc-submit-button"
            :style="submitButtonStyle"
            :onclick="handleSubmitButton"
            :invalid="inputInvalid"
            :disabled="disabled"
            :speaking="speaking"
          >
            <component :is="(isInputValueEmpty() || speaking) && isRecognitionEnabled ? MicIcon : SubmitIcon" ></component>
          </SubmitButton>
        </div>
      </Footer>
    </ChatBotContainer>
  </div>
</template>

<script setup lang="ts">
  import BotDiv from '../BotDiv.vue';
  import type { CSSProperties, Component, DefineComponent } from 'vue';
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import Random from 'random-id';
  import { CustomStep, OptionsStep, TextStep } from './Steps';
  import schema from '../schemas/schema.ts';
  import * as storage from '../utils/storage';

  import {
    ChatBotContainer,
    Content,
    Header,
    HeaderTitle,
    HeaderIcon,
    FloatButton,
    FloatingIcon,
    Footer,
    VueChatBotInput,
    SubmitButton
  } from './index';

  import Recognition from '../utils/recognition';
  import { ChatIcon, CloseIcon, SubmitIcon, MicIcon } from './Icons/index';
  import isMobile from '../utils/isMobile';
  import { speakFn } from '../utils/speechSynthesis';
  import Step, { StepsMap } from 'types/Step';

  type Props = {
    avatarStyle?: CSSProperties;
    botAvatar?: string;
    botName?: string
    botDelay?: number
    bubbleOptionStyle?: CSSProperties; 
    bubbleStyle?: CSSProperties; 
    cache?: boolean;
    cacheName?: string
    contentStyle?: CSSProperties; 
    customDelay?: number
    customStyle: CSSProperties; 
    controlStyle: CSSProperties; 
    enableMobileAutoFocus?: boolean;
    enableSmoothScroll?: boolean;
    ExtraControl?: DefineComponent<Component<{disabled:boolean, speaking:boolean, invalid: boolean}>>; 
    floating?: boolean;
    floatingIconProp?: string | DefineComponent;
    floatingStyle?: {
      top: string;
      bottom: string;
      left: string;
      right: string;
      transformOrigin: string;
    };
    footerStyle?: CSSProperties;
    handleEnd?: Function;
    HeaderComponent?: DefineComponent;
    headerTitle?: string
    height?: string
    hideBotAvatar?: boolean;
    hideHeader?: boolean
    hideSubmitButton?: boolean;
    hideUserAvatar?: boolean;
    inputAttributes?: CSSProperties; 
    inputStyle?: CSSProperties;
    opened?: boolean
    toggleFloating?: (newState:boolean) => {};
    placeholder?: string
    recognitionEnable?: boolean;
    recognitionLang?: string
    recognitionPlaceholder?: string
    speechSynthesis?: {
      enable: boolean
      lang: string
      voice: SpeechSynthesisVoice | any;
    }
    steps: StepsMap;
    style?: CSSProperties;
    submitButtonStyle?: CSSProperties;
    userAvatar?: string
    userDelay?: number
    width?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    avatarStyle: () => {return {}},
    botDelay: 1000,
    botName: 'The bot',
    bubbleOptionStyle: () => {return {}},
    bubbleStyle: () => {return {}},
    cache: false,
    cacheName: 'rsc_cache',
    className: '',
    contentStyle: () => {return {}},
    customStyle: () => {return {}},
    controlStyle: () => { return {position: 'absolute', right: '0', top: '0'} },
    customDelay: 1000,
    enableMobileAutoFocus: false,
    enableSmoothScroll: false,
    floating: false,
    floatingIcon: () => ChatIcon,
    footerStyle: () => {return {}},
    headerTitle: 'Chat',
    height: '520px',
    hideBotAvatar: false,
    hideHeader: false,
    hideSubmitButton: false,
    hideUserAvatar: false,
    inputStyle: () => {return {}},
    placeholder: 'Type the message ...',
    inputAttributes: () => {return {} as CSSProperties},
    recognitionEnable: false,
    recognitionLang: 'en',
    recognitionPlaceholder: 'Listening ...',
    speechSynthesis: () => {
      return {
        enable: false,
        lang: 'en',
        voice: null
      }
    },
    style: () => {return {}},
    submitButtonStyle: () => {return {}},
    userDelay: 1000,
    width: '350px',
    botAvatar:
      "data:image/svg+xml,%3csvg version='1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3cpath d='M303 70a47 47 0 1 0-70 40v84h46v-84c14-8 24-23 24-40z' fill='%2393c7ef'/%3e%3cpath d='M256 23v171h23v-84a47 47 0 0 0-23-87z' fill='%235a8bb0'/%3e%3cpath fill='%2393c7ef' d='M0 240h248v124H0z'/%3e%3cpath fill='%235a8bb0' d='M264 240h248v124H264z'/%3e%3cpath fill='%2393c7ef' d='M186 365h140v124H186z'/%3e%3cpath fill='%235a8bb0' d='M256 365h70v124h-70z'/%3e%3cpath fill='%23cce9f9' d='M47 163h419v279H47z'/%3e%3cpath fill='%2393c7ef' d='M256 163h209v279H256z'/%3e%3cpath d='M194 272a31 31 0 0 1-62 0c0-18 14-32 31-32s31 14 31 32z' fill='%233c5d76'/%3e%3cpath d='M380 272a31 31 0 0 1-62 0c0-18 14-32 31-32s31 14 31 32z' fill='%231e2e3b'/%3e%3cpath d='M186 349a70 70 0 1 0 140 0H186z' fill='%233c5d76'/%3e%3cpath d='M256 349v70c39 0 70-31 70-70h-70z' fill='%231e2e3b'/%3e%3c/svg%3e",
    userAvatar:
      "data:image/svg+xml,%3csvg viewBox='-208.5 21 100 100' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3ccircle cx='-158.5' cy='71' fill='%23F5EEE5' r='50'/%3e%3cdefs%3e%3ccircle cx='-158.5' cy='71' id='a' r='50'/%3e%3c/defs%3e%3cclipPath id='b'%3e%3cuse overflow='visible' xlink:href='%23a'/%3e%3c/clipPath%3e%3cpath clip-path='url(%23b)' d='M-108.5 121v-14s-21.2-4.9-28-6.7c-2.5-.7-7-3.3-7-12V82h-30v6.3c0 8.7-4.5 11.3-7 12-6.8 1.9-28.1 7.3-28.1 6.7v14h100.1z' fill='%23E6C19C'/%3e%3cg clip-path='url(%23b)'%3e%3cdefs%3e%3cpath d='M-108.5 121v-14s-21.2-4.9-28-6.7c-2.5-.7-7-3.3-7-12V82h-30v6.3c0 8.7-4.5 11.3-7 12-6.8 1.9-28.1 7.3-28.1 6.7v14h100.1z' id='c'/%3e%3c/defs%3e%3cclipPath id='d'%3e%3cuse overflow='visible' xlink:href='%23c'/%3e%3c/clipPath%3e%3cpath clip-path='url(%23d)' d='M-158.5 100.1c12.7 0 23-18.6 23-34.4 0-16.2-10.3-24.7-23-24.7s-23 8.5-23 24.7c0 15.8 10.3 34.4 23 34.4z' fill='%23D4B08C'/%3e%3c/g%3e%3cpath d='M-158.5 96c12.7 0 23-16.3 23-31 0-15.1-10.3-23-23-23s-23 7.9-23 23c0 14.7 10.3 31 23 31z' fill='%23F2CEA5'/%3e%3c/svg%3e"
  })
  
  // state declarations
  const contentRef = ref<HTMLElement>();
  const currentStep = ref<Step>({
    id: 'first-step',
    botName: 'VueChatBot',
    avatar: 'holla',
    message: 'Hello world',
    asMessage: 'true',
    value: 'Hello world',
    delay: 1000,
    waitAction: false,
    update: 'there',
    trigger: 'there',
    validator: () => {},
  })
  const defaultUserSettings = ref({
    delay: props.userDelay,
    avatar: props.userAvatar,
    hideInput: false,
    hideExtraControl: false
  })
  const disabled = ref(true)
  const input = ref<HTMLElement>();
  const inputValue = ref('')
  const inputInvalid = ref(false)
  const isOpened = ref(props.opened || !props.floating)
  const previousStep = ref<Step>()
  const previousSteps = ref<(Step)[]>([])
  const isRecognitionEnabled = ref(props.recognitionEnable && Recognition.isSupported())
  const recognition = ref<Recognition>()
  const renderedSteps = ref<(Step)[]>([])
  const stepsState = ref<StepsMap>(new Map())
  const supportsScrollBehavior = ref(false);
  const speaking = ref(false)
  const speak = ref(speakFn(props.speechSynthesis))

  // handlers for events
  const onRecognitionChange = (value:string) => {
    inputValue.value = value;
  };

  const onRecognitionEnd = () => {
    speaking.value = false;
    handleSubmitButton();
  };

  const onRecognitionStop = () => {
    speaking.value = false;
  };

  const onNodeInserted = (event:Event) => {
    const target = event.currentTarget as HTMLInputElement
    
    if (props.enableSmoothScroll && supportsScrollBehavior.value) {
      target.scroll({
        top: target.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      target.scrollTop = target.scrollHeight;
    }
  };

  const onResize = () => {
    if(contentRef.value) contentRef.value.scrollTop = contentRef.value.scrollHeight;
  };

  const onValueChange = (event:Event) => {
    inputValue.value = (event.target as HTMLInputElement).value
  };

  const isInputValueEmpty = () => {
    return !inputValue.value || inputValue.value.length === 0;
  };

  const isLastPosition = (step:Step) => {
    const { length } = renderedSteps.value;
    const stepIndex = renderedSteps.value.map(s => s.key).indexOf(step.key);

    if (length <= 1 || stepIndex + 1 === length) {
      return true;
    }

    const nextStep = renderedSteps.value[stepIndex + 1];
    const hasMessage = nextStep.message || nextStep.asMessage;

    if (!hasMessage) {
      return true;
    }

    const isLast = step.user !== nextStep.user;
    return isLast;
  };

  const isFirstPosition = (step:Step) => {
    const stepIndex = renderedSteps.value.map(s => s.key).indexOf(step.key);

    if (stepIndex === 0) {
      return true;
    }

    const lastStep = renderedSteps.value[stepIndex - 1];
    const hasMessage = lastStep.message || lastStep.asMessage;

    if (!hasMessage) {
      return true;
    }

    const isFirst = step.user !== lastStep.user;
    return isFirst;
  };

  const handleKeyPress = (event:KeyboardEvent) => {
    if (event.key === 'Enter') {
      submitUserMessage();
    }
  };

  const handleSubmitButton = () => {
    if ((isInputValueEmpty() || speaking.value) && isRecognitionEnabled.value) {
      recognition.value?.speak();

      if (!speaking.value) {
        
        speaking.value = true;
      }

      return;
    }

    submitUserMessage();
  }

  // Define methods for chatbot logic
  const generateRenderedStepsById = () => {
    const steps:StepsMap = new Map();

    for (let i = 0, len = previousSteps.value.length; i < len; i += 1) {
      const { id, message, value, metadata } = previousSteps.value[i];
      

      steps.set(id, {
        id,
        message,
        value,
        metadata,
        botName: '',
        avatar: '',
        asMessage: '',
        delay: 0,
        waitAction: false,
        update: '',
        trigger: '',
        validator: () => {}
      });
    }

    return steps;
  };

  const getTriggeredStep = (trigger:string | Function, value:string):string => {
    const steps = generateRenderedStepsById();
    return typeof trigger === 'function' ? trigger(value, steps) : trigger;
  };

  const getStepMessage = (message:string | Function) => {
    const lastStepIndex = previousSteps.value.length > 0 ? previousSteps.value.length - 1 : 0;
    const steps = generateRenderedStepsById();
    const previousValue = previousSteps.value[lastStepIndex].value;
    return typeof message === 'function' ? message({ previousValue, steps }) : message;
  };

  const handleEnd = () => {
    if (props.handleEnd) {
      const renderedSteps = previousSteps.value.map(step => {
        const { id, message, value, metadata } = step;

        return {
          id,
          message,
          value,
          metadata
        };
      });

      const steps:StepsMap = new Map();

      for (let i = 0, len = previousSteps.value.length; i < len; i += 1) {
        const { id, message, value, metadata } = previousSteps.value[i];

        steps.set(id, {
          id,
          message,
          value,
          metadata,
          botName: '',
          avatar: '',
          asMessage: '',
          delay: 0,
          waitAction: false,
          update: '',
          trigger: '',
          validator: ()=>{}
        });
      }

      const values = previousSteps.value.filter(step => step.value).map(step => step.value);

      props.handleEnd({ renderedSteps, steps, values });
    }
  };

  const checkInvalidInput = () => {
    if(!currentStep.value){
      console.warn("currentStep not found. VueChatBot.vue:330");
      return false;
    }

    const result = currentStep.value.validator(inputValue.value);
    const value = inputValue.value;

    if (typeof result !== 'boolean' || !result) {
      inputValue.value = result.toString();
      inputInvalid.value = true;
      disabled.value = true;

      setTimeout(() => {
        inputValue.value = value;
        inputInvalid.value = false;
        disabled.value = false;
        if (props.enableMobileAutoFocus || !isMobile()) {
          if (input.value) {
            input.value.focus();
          }
        }
      }, 1000);

      return true;
    }

    return false;
  };

  const submitUserMessage = () => {

    const isInvalid = currentStep.value?.validator() && checkInvalidInput();

    if (!isInvalid) {
      const step = {
        user: true,
        message: inputValue.value,
        value: inputValue.value,
      };

      currentStep.value = Object.assign({}, defaultUserSettings.value, currentStep.value, step);

      renderedSteps.value.push(currentStep.value);
      previousSteps.value.push(currentStep.value);

      disabled.value = true;
      inputValue.value = '';
      
      if (input.value) {
        input.value.blur();
      }
    }
  };

  const toggleChatBot = (newState:boolean) => {
    console.log('toggleChatBot has run, new state is ', newState);
    
    if (props.toggleFloating) {
      props.toggleFloating( newState );
    } else {
      isOpened.value = newState;
    }
  };

    // main logic function
  const triggerNextStep = (data:Step | undefined) => {
    if(!currentStep.value){
      console.warn("currentStep doesn't exist. VueChatBot.vue:229");
      return;
    }
    
    const isEnd = currentStep.value.end;

    if (data && data.value) {
      currentStep.value.value = data.value;
    }
    if (data && data.hideInput) {
      currentStep.value.hideInput = data.hideInput;
    }
    if (data && data.hideExtraControl) {
      currentStep.value.hideExtraControl = data.hideExtraControl;
    }
    if (data && data.trigger) {
      currentStep.value.trigger = getTriggeredStep(data.trigger, data.value);
    }

    if (isEnd) {
      handleEnd();

    } else if (currentStep.value.options && data) {

      const option = currentStep.value.options.filter(option => option.value === data.value)[0];
      const trigger = getTriggeredStep(option.trigger, currentStep.value.value);
      delete currentStep.value.options;

      // replace choose option for user message
      currentStep.value = Object.assign({}, currentStep.value, option, defaultUserSettings.value, {
        user: true,
        message: option.label,
        trigger
      });

      renderedSteps.value.pop();
      previousSteps.value.pop();
      renderedSteps.value.push(currentStep.value as Step);
      previousSteps.value.push(currentStep.value as Step);

    } else if (currentStep.value.trigger) {

      if (currentStep.value.replace) {
        renderedSteps.value.pop();
      }

      const trigger = getTriggeredStep(currentStep.value.trigger, currentStep.value.value);
      let nextStep = Object.assign({}, stepsState.value.get(trigger));

      if (nextStep.message) {
        nextStep.message = getStepMessage(nextStep.message);

      } else if (nextStep.update) {

        const updateStep = nextStep;
        nextStep = Object.assign({}, stepsState.value.get(updateStep.update));

        if (nextStep.options) {
          for (let i = 0, len = nextStep.options.length; i < len; i += 1) {
            nextStep.options[i].trigger = updateStep.trigger;
          }
        } else {
          nextStep.trigger = updateStep.trigger;
        }
      }

      nextStep.key = Random(24);

      previousStep.value = currentStep.value;
      currentStep.value = nextStep;

      
      if (nextStep.user) {
        disabled.value = false;
        
        if (props.enableMobileAutoFocus || !isMobile()) {
          if (input.value) {
            input.value.focus();
          }
        }

      } else {
        renderedSteps.value.push(nextStep);
        previousSteps.value.push(nextStep);
      }
      
    }

    if (props.cache) {
      setTimeout(() => {
        storage.setData(props.cacheName, {
          currentStep: currentStep.value as Step,
          previousStep: previousStep.value,
          previousSteps: previousSteps.value,
          renderedSteps: renderedSteps.value
        });
      }, 300);
    }
  };

  // setup the component on mount 
  onMounted(() => {
    console.log('onMounted is gonna run!');
    
    // this hold the actual chat steps
    const chatSteps:StepsMap = new Map();
  
    // import default settings
    const defaultBotSettings = { delay: props.botDelay, avatar: props.botAvatar, botName: props.botName };
    const defaultCustomSettings = { delay: props.customDelay };

    // parse the steps, and add them to the actual chat steps
    const stepsArray = Array.from(props.steps.values());

    for (let i = 0, len = stepsArray.length; i < len; i += 1) {
      const step = stepsArray[i];
  
      let settings = {};
  
      if (step.user) {
        settings = defaultUserSettings.value;

      } else if (step.message || step.asMessage) {
        settings = defaultBotSettings;

      } else if (step.component) {
        settings = defaultCustomSettings;
      }
      
      chatSteps.set(step.id, Object.assign({}, settings, schema.parse(step)) );
    }
  
    schema.checkInvalidIds(chatSteps);
  
    const firstStep = stepsArray[0];
    
    if (firstStep.message) {
      const { message } = firstStep;
      firstStep.message = typeof message === 'function' ? message() : message;
      const correspondingFirstStep = chatSteps.get(firstStep.id);
      if(correspondingFirstStep) correspondingFirstStep.message = firstStep.message;
    }
  
    // check recognition feature
    if (isRecognitionEnabled.value) {
      recognition.value = new Recognition(
        onRecognitionChange,
        onRecognitionEnd,
        onRecognitionStop,
        props.recognitionLang
      );
    }
  
    supportsScrollBehavior.value = 'scrollBehavior' in document.documentElement.style;
  
    if (contentRef.value) {
      // contentRef.value.addEventListener('DOMNodeInserted', onNodeInserted);
      window.addEventListener('resize', onResize);
    }
  
    // fetch cached data, if any
    const { 
      currentStep: cachedCurrentStep, 
      previousStep: cachedPreviousStep,
      previousSteps: cachedPreviousSteps,
      renderedSteps: cachedRenderedSteps
    } = storage.getData(
      {
        cacheName: props.cacheName,
        useCache: props.cache,
        firstStep,
        steps: chatSteps
      },
      () => {
        // focus input if last step cached is a user step
        disabled.value = false;
        if (props.enableMobileAutoFocus || !isMobile()) {
          console.log('input will be focused');
          
          if (input.value) input.value.focus();
        }
      }
    );
    
    currentStep.value = cachedCurrentStep;
    previousStep.value = cachedPreviousStep;
    previousSteps.value = cachedPreviousSteps;
    renderedSteps.value = cachedRenderedSteps;
    stepsState.value = chatSteps;

    // derive state from props
    if (props.toggleFloating !== undefined && props.opened !== undefined && props.opened !== isOpened.value) isOpened.value = props.opened;

    // scroll to the bottom of chat container
    const target = contentRef.value as HTMLInputElement;
    
    if (props.enableSmoothScroll && supportsScrollBehavior.value) {
      target.scroll({
        top: target.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      target.scrollTop = target.scrollHeight;
    }
    
    if(input.value) input.value.focus();
  })

  onBeforeUnmount(()=>{
    if(contentRef.value) {
      // contentRef.value.removeEventListener('DOMNodeInserted', onNodeInserted);
      window.removeEventListener('resize', onResize);
    }
  })

  // render variables & methods
  const renderVueStep = (step:Step, index:number) => {
    const { options, component, asMessage } = step;
    const steps = generateRenderedStepsById();
    const previousStep = index > 0 ? renderedSteps.value[index - 1] : {} as Step;

    if (component && !asMessage) {
      return {
        component: CustomStep,
        props: {
          key: index,
          speak: speak.value,
          step,
          steps,
          style: props.customStyle,
          previousStep,
          previousValue: previousStep.value,
          triggerNextStep,
        }
      }
    }

    if (options) {
      return {
        component: OptionsStep,
        props: {
          key: index,
          step,
          previousValue: previousStep.value,
          triggerNextStep,
          bubbleOptionStyle: props.bubbleOptionStyle,
        }
      }
    }

    return {
      component: TextStep,
      props: {
        key: index,
        step,
        steps,
        speak: speak.value,
        previousStep,
        previousValue: previousStep.value,
        triggerNextStep,
        avatarStyle: props.avatarStyle,
        bubbleStyle: props.bubbleStyle,
        hideBotAvatar: props.hideBotAvatar,
        hideUserAvatar: props.hideUserAvatar,
        speechSynthesis,
        isFirst: isFirstPosition(step),
        isLast: isLastPosition(step)
      }
    }
  };

  const renderSteps = () => renderedSteps.value.map((step, index) => renderVueStep(step, index))

  const inputPlaceholder = speaking.value ? props.recognitionPlaceholder : currentStep.value?.placeholder || props.placeholder;

  const inputAttributesOverride = currentStep.value?.inputAttributes || props.inputAttributes;

</script>