import React from 'react';
interface PanelProps {
    cacheData: Record<string, any>;
    mutate: (key: string) => Promise<any>;
    cache: Map<string, any>;
    mutations: any[];
    isMiddlewareActive: boolean;
    isOpen: boolean;
    onClose: () => void;
}
export declare const Panel: React.FC<PanelProps>;
export {};
