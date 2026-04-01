export interface AskOptions {
    defaultAnswer?: string | undefined;
    validator?: ((s: string) => boolean) | undefined;
}
export interface Choice {
    label: string;
    value: string;
}
export declare const openInteractionManager: () => {
    ask: (question: string, options?: AskOptions) => Promise<string | undefined>;
    choose: (question: string, choices: Choice[], optional?: boolean) => Promise<Choice | undefined>;
    close: () => void;
};
//# sourceMappingURL=interaction-manager.d.ts.map