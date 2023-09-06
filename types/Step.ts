type Step = {
    user: string;
    message: string | undefined;
    metadata: {
        speak?: string
    };
}

export default Step