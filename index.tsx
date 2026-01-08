import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

declare global {
  // Augment the existing AIStudio interface which is expected by the global scope
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const ApiKeyGuard: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          console.error("Failed to check API key status", e);
          setHasKey(false);
        }
      } else {
        // Fallback for local development or environments without aistudio
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assuming success after the dialog closes/returns
        setHasKey(true);
      } catch (e) {
        console.error("Failed to select API key", e);
      }
    }
  };

  if (hasKey === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hasKey === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans text-slate-800">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 mb-4 font-['Outfit']">
                MIX-IMAGE
            </h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
                To access professional AI models (Gemini 3 Pro) and ensure the best experience, please select your API Key.
            </p>
            <button 
                onClick={handleSelectKey}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 8a6 6 0 20-12 0 6 6 0 0012 0zm-6-3a1 1 0 11-2 0 1 1 0 012 0zM8 9a1 1 0 00-1 1v1.172a2 2 0 01-.586 1.414l-5 5c-.778.778-.375 1.7.586 1.7h11.172c.961 0 1.373-.923.586-1.7l-5-5A2 2 0 018 11.172V10a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Select API Key
            </button>
            <div className="mt-6 text-xs text-slate-400">
                <p>For high-resolution image generation.</p>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500 mt-2 inline-block">
                    Billing Documentation
                </a>
            </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

root.render(
  <React.StrictMode>
    <ApiKeyGuard>
      <App />
    </ApiKeyGuard>
  </React.StrictMode>
);