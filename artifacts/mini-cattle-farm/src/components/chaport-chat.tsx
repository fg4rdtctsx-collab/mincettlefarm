import { useEffect } from 'react';
import { useBrowserLocation, useSearch } from 'wouter/use-browser-location';
import { createChaportController } from '@/lib/chaport';

let controller: ReturnType<typeof createChaportController> | undefined;

export function ChaportChat() {
  const [path] = useBrowserLocation();
  const search = useSearch();
  useEffect(() => {
    controller ??= createChaportController(window, document, import.meta.env.BASE_URL);
    controller.sync();
    window.addEventListener('hashchange', controller.sync);
    return () => window.removeEventListener('hashchange', controller!.sync);
  }, [path, search]);
  return null;
}