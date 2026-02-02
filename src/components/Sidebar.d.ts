import React from 'react';
interface SidebarProps {
    keys: string[];
    cacheData: Record<string, any>;
    mutations: any[];
    isMiddlewareActive: boolean;
    selectedKey: string | null;
    onSelect: (key: string) => void;
    width: number;
}
export declare const Sidebar: React.FC<SidebarProps>;
export {};
