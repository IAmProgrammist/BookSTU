export const DEBUG = process.env.REACT_APP_DEBUG === "true";
export const ENV_API_SERVER = DEBUG ? process.env.REACT_APP_ENV_API_SERVER : window.location.origin; 