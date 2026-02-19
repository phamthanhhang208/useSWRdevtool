import { useSWRConfig } from 'swr';
import { useEffect, useState } from 'react';
import { devToolsStore } from '../store';

export function useSWRDevTools() {
  const { cache, mutate: globalMutate } = useSWRConfig();
  const [cacheData, setCacheData] = useState<Record<string, any>>({});
  const [, setTick] = useState(0); // Force update on store change

  // Sync with store
  useEffect(() => {
    const unsubscribe = devToolsStore.subscribe(() => {
      setTick(t => t + 1);
    });
    return () => { unsubscribe(); };
  }, []);

  // Poll cache for data changes
  useEffect(() => {
    const updateCacheData = () => {
      const allData: Record<string, any> = {};
      // @ts-ignore
      const keys = Array.from(cache.keys());
      
      keys.forEach((key) => {
        const state = cache.get(key);
        allData[key] = state;
      });
      
      setCacheData(allData);
    };

    const intervalId = setInterval(updateCacheData, 500);
    updateCacheData();

    return () => clearInterval(intervalId);
  }, [cache]);

  const mutate = async (serializedKey: string) => {
    const originalKey = devToolsStore.getOriginalKey(serializedKey);
    // If we have original key, use it. Otherwise fall back to serialized (might work for strings)
    return globalMutate(originalKey || serializedKey);
  };

  return { 
    cacheData, 
    mutate, 
    cache, 
    mutations: devToolsStore.getMutations(),
    isMiddlewareActive: devToolsStore.isMiddlewareActive()
  };
}
