export const DEBUG = process.env.REACT_APP_DEBUG === "true";
export const ENV_API_SERVER = DEBUG ? process.env.REACT_APP_ENV_API_SERVER : window.location.origin; 
export const SENTRY_DSN = "https://29e5d2d767b9444cbd86563a21e18269@app.glitchtip.com/9662"