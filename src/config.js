const getApiUrl = () => {
    // If VITE_API_URL is set (e.g. in Vercel), use it.
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Fallback for local development
    return 'http://localhost:5000';
};

export const API_URL = getApiUrl();
