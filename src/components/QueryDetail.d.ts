import React from 'react';
interface QueryDetailProps {
    queryKey: string;
    data: any;
    onMutate: (key: string) => void;
    onDelete: (key: string) => void;
}
export declare const QueryDetail: React.FC<QueryDetailProps>;
export {};
