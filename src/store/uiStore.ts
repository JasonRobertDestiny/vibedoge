import { create } from 'zustand';

interface UIState {
  language: 'zh' | 'en';
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setLanguage: (language: 'zh' | 'en') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  language: 'zh',
  theme: 'dark',
  sidebarOpen: false,
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));