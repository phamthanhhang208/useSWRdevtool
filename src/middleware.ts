import { Middleware, SWRHook } from 'swr';
// @ts-ignore
import { unstable_serialize } from 'swr'; 
import { devToolsStore } from './store';
import { useEffect } from 'react';

export const swrDevToolsMiddleware: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {
  const serializedKey = unstable_serialize(key);

  // Register the original key immediately
  devToolsStore.registerKey(serializedKey, key);
  devToolsStore.activateMiddleware();

  // Wrap fetcher to detect mutations
  const extendedFetcher = (...args: any[]) => {
    const isMutation = args.length > 1; // Heuristic: useSWRMutation passes (key, { arg })
    const fetchId = Math.random().toString(36).substr(2, 9);
    
    if (isMutation) {
      devToolsStore.addMutation({
        id: fetchId,
        key: serializedKey,
        startTime: Date.now(),
        status: 'pending',
        data: undefined
      });
    }

    // @ts-ignore
    const result = fetcher ? fetcher(...args) : undefined;

    if (result && typeof (result as any).then === 'function' && isMutation) {
      return (result as Promise<any>).then((data: any) => {
        devToolsStore.updateMutation(fetchId, { status: 'success', data, endTime: Date.now() });
        return data;
      }).catch((err: any) => {
        devToolsStore.updateMutation(fetchId, { status: 'error', error: err, endTime: Date.now() });
        throw err;
      });
    }

    return result;
  };

  const swrResponse = useSWRNext(key, extendedFetcher, config);

  // Effect to track data changes/loading (optional, for history)
  useEffect(() => {
    // If we wanted to track every change, we could do it here.
    // For now, key registration is the critical part for Actions.
  }, [serializedKey, swrResponse.data, swrResponse.error, swrResponse.isLoading]);

  return swrResponse;
};

