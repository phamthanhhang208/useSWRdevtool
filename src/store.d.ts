type Listener = () => void;
declare class DevToolsStore {
    private keyMap;
    private listeners;
    private mutations;
    private hasInstalledMiddleware;
    subscribe(listener: Listener): () => boolean;
    activateMiddleware(): void;
    isMiddlewareActive(): boolean;
    notify(): void;
    registerKey(serializedKey: string, originalKey: any): void;
    getOriginalKey(serializedKey: string): any;
    getKeys(): string[];
    addMutation(mutation: any): void;
    updateMutation(id: string, update: any): void;
    getMutations(): {
        id: string;
        key: string;
        startTime: number;
        endTime?: number;
        status: string;
        data?: any;
        error?: any;
    }[];
}
export declare const devToolsStore: DevToolsStore;
export {};
