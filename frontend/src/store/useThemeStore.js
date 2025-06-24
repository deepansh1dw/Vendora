import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem('theme') || 'light';
  }
  return 'light';
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (newTheme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem('theme', newTheme);
    }
    set({ theme: newTheme });
  }
}));
