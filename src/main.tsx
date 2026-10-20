import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handlers for Google Maps authentication & quota defense
(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-auth-failed'));
};

const origError = console.error;
console.error = (...args: unknown[]) => {
  origError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (
    msg.includes('InvalidKeyMapError') || 
    msg.includes('ApiProjectMapError') || 
    msg.includes('OverQuotaMapError') ||
    msg.includes('QuotaExceededError')
  ) {
    window.dispatchEvent(new CustomEvent('gmp-auth-failed'));
  }
};

createRoot(document.getElementById('root')!).render(<App />);
