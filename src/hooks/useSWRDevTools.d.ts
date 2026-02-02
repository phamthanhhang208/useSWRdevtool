export declare function useSWRDevTools(): {
    cacheData: Record<string, any>;
    mutate: (serializedKey: string) => Promise<any[]>;
    cache: import("swr").Cache<any>;
    mutations: {
        id: string;
        key: string;
        startTime: number;
        endTime?: number;
        status: string;
        data?: any;
        error?: any;
    }[];
    isMiddlewareActive: boolean;
};
