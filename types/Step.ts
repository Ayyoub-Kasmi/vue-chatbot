import { Component, DefineComponent, CSSProperties } from "vue";

type Step = {
    id:string;
    key?: string;
    user: boolean;
    botName: string;
    avatar: string;
    component?: DefineComponent | string;
    rendered?: boolean;
    message: string | Function;
    placeholder?: string;
    asMessage: string;
    value: string;
    delay: number;
    update: string;
    replace?: boolean;
    options?: StepOption[];
    hideInput?: boolean;
    waitAction: boolean;
    hideExtraControl?: boolean;
    trigger: string | Function;
    validator: Function;
    end?: boolean;
    inputAttributes?: CSSProperties; 
    metadata?: {
        speak?: string
    };
}

export type StepOption = {
    label: string;
    value: string;
    trigger: string | Function;
};

export type StepsMap = Map<string, Step>

export default Step