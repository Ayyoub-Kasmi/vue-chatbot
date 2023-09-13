import Step, { StepsMap } from './Step'

type VueBotCache = {
    renderedSteps: Step[];
    previousStep?: Step;
    previousSteps: Step[];
    currentStep: Step;
}

export type CacheParams = {
  cacheName: string;
  useCache: boolean;
  firstStep: Step;
  steps: StepsMap
}

export default VueBotCache;