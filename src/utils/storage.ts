import { stringify, parse } from 'flatted'
import Step from 'types/Step';
import VueBotCache, { CacheParams } from 'types/VueBotCache'

/* istanbul ignore next */
const getData = (params:CacheParams, callback:Function):VueBotCache => {
  const { cacheName, useCache, firstStep, steps } = params;
  const currentStep = firstStep;
  const renderedSteps = [steps.get(currentStep.id)].filter((item):item is Step => typeof item !== 'undefined');
  const previousSteps = [steps.get(currentStep.id)].filter((item):item is Step => typeof item !== 'undefined');
  let previousStep:Step | undefined;
  const unParsedCache = localStorage.getItem(cacheName);

  if (useCache && unParsedCache) {
    try {
      const data:VueBotCache = parse(unParsedCache);
      const lastStep = data.renderedSteps[data.renderedSteps.length - 1];

      if (lastStep && lastStep.end) {
        localStorage.removeItem(cacheName);

      } else {
        data.renderedSteps.forEach(renderedStep => {
          // remove delay of cached rendered steps
          renderedStep.delay = 0;
          // flag used to avoid call triggerNextStep in cached rendered steps
          renderedStep.rendered = true;
  
          // an error is thrown when render a component from localStorage.
          // So it's necessary reassing the component
          if (renderedStep.component) {
            const { id } = renderedStep;
            const targetStep = steps.get(id);
            if(targetStep) renderedStep.component = targetStep.component;
            else console.warn("targetStep doesn't exist. storage.ts: 41");
          }
        })

        const { trigger, end, options } = data.currentStep;
        const { id } = data.currentStep;

        if (options) {
          delete data.currentStep.rendered;
        }

        // add trigger function to current step
        if (!trigger && !end) {
          if (options) {
            for (let i = 0; i < options.length; i += 1) {
              const targetStep = steps.get(id);
              if(targetStep && targetStep.options) options[i].trigger = targetStep.options[i].trigger;
              else console.warn("targetStep doesn't exist or doesn't have options. storage.ts:57");
            }
          } else {
            const targetStep = steps.get(id);
            if(targetStep) data.currentStep.trigger = targetStep.trigger;
            else console.warn("targetStep doesn't exist. storage.ts:62")
          }
        }

        // execute callback function to enable input if last step is
        // waiting user type
        if (data.currentStep.user) {
          callback();
        }

        return {...data, previousStep: undefined, previousSteps: []};
      }
    } catch (error) {
      console.info(`Unable to parse cache named:${cacheName}. \nThe cache was probably created with an older version of vue-chatbot.\n`, error);
    }
  }

  return {
    currentStep,
    previousStep,
    previousSteps,
    renderedSteps
  };
};

/* istanbul ignore next */
const setData = (cacheName:string, cachedData:VueBotCache) => {
  const data:VueBotCache = parse(stringify(cachedData));
  // clean components
  data.renderedSteps.forEach(renderedStep => {
    if(renderedStep.component) renderedStep.component = renderedStep.id;
  })

  if(data.currentStep.component) data.currentStep.component = data.currentStep.id;

  localStorage.setItem(cacheName, stringify(data));
};

export { getData, setData };
