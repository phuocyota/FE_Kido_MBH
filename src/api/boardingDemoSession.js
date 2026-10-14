export const BOARDING_DEMO_PATH = "/boarding-orders/demo";

export const getBoardingDemoToken = () => {
  if (!import.meta.env.DEV) return null;
  if (window.location.pathname.replace(/\/$/, "") !== BOARDING_DEMO_PATH) return null;
  return import.meta.env.VITE_BOARDING_DEMO_TOKEN?.trim() || null;
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
