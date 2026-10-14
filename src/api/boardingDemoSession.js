export const BOARDING_DEMO_PATH = "/boarding-orders/demo";
const DEMO_TOKEN_KEY = "boardingDemoToken";

export const saveBoardingDemoToken = (token) => {
  sessionStorage.setItem(DEMO_TOKEN_KEY, token.trim());
};

export const getBoardingDemoToken = () => {
  if (window.location.pathname.replace(/\/$/, "") !== BOARDING_DEMO_PATH) return null;
  const sessionToken = sessionStorage.getItem(DEMO_TOKEN_KEY);
  if (sessionToken) return sessionToken;
  if (import.meta.env.DEV) return import.meta.env.VITE_BOARDING_DEMO_TOKEN?.trim() || null;
  return null;
};

export const decodeBoardingDemoToken = (token) => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(payload), (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
};
