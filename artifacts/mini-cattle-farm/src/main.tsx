import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import { restorePagesRoute } from '@/lib/pages-route';

import './index.css';

const restoredRoute = restorePagesRoute(window.location.href, import.meta.env.BASE_URL);
if (restoredRoute) window.history.replaceState(null, '', restoredRoute);

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
