import Step, { StepsMap } from 'types/Step';
import userSchema from './userSchema';
import textSchema from './textSchema';
import optionsSchema from './optionsSchema';
import customSchema from './customSchema';
import updateSchema from './updateSchema';
import { stringify } from 'flatted';

const schema = {
  parse(step:Step) {
    let parser = [];

    if (step.user) {
      parser = userSchema;
    } else if (step.message) {
      parser = textSchema;
    } else if (step.options) {
      parser = optionsSchema;
    } else if (step.component) {
      parser = customSchema;
    } else if (step.update) {
      parser = updateSchema;
    } else {
      throw new Error(`The step ${stringify(step)} is invalid`);
    }

    for (let i = 0, len = parser.length; i < len; i += 1) {
      const { key, types, required } = parser[i];

      if (!step[key] && required) {
        throw new Error(`Key '${key}' is required in step ${stringify(step)}`);
      } else if (step[key]) {
        if (types[0] !== 'any' && types.indexOf(typeof step[key]) < 0) {
          throw new Error(
            `The type of '${key}' value must be ${types.join(' or ')} instead of ${typeof step[
              key
            ]}`
          );
        }
      }
    }

    const keys = parser.map(p => p.key);

    for (const key in step) {
      if (keys.indexOf(key) < 0) {
        console.error(`Invalid key '${key}' in step '${step.id}'`);
        delete step[key];
      }
    }

    return step;
  },

  checkInvalidIds(steps:StepsMap) {
    steps.forEach((step, key) => {
      // check if there are options
      if(step.options){
        //get triggers for options
        const optionsTriggerIds = step.options.map(Option => Option.trigger);

        optionsTriggerIds.forEach((optionTriggerId, i) => {
          //check that, for every option's trigger ID, there is a corresponeding step
          if(optionTriggerId && !steps.get(optionTriggerId)) 
            throw new Error(`The id '${optionTriggerId}' triggered by option ${i + 1} in step '${steps.get(key)?.id}' does not exist`)
        })
      }

      // if the step trigger exists but there's no corresponding step
      else if(step.trigger && !steps.get(step.trigger))
          throw new Error(`The id '${step.trigger}' triggered by step '${steps.get(key)?.id}' does not exist`)
    })
  }
};

export default schema;
