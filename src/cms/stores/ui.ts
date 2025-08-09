import { create } from 'zustand';
import { SaveStatus } from '../types';

interface UIState {
  // Save status
  saveStatus: SaveStatus;
  saveMessage: string;
  lastSaved: Date | null;
  
  // UI state
  activeTab: string;
  sidebarOpen: boolean;
  
  // Actions
  setSaveStatus: (status: SaveStatus, message?: string) => void;
  setLastSaved: (date: Date) => void;
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  saveStatus: 'idle',
  saveMessage: '',
  lastSaved: null,
  activeTab: 'texts',
  sidebarOpen: false,

  // Actions
  setSaveStatus: (status, message = '') =>
    set({ saveStatus: status, saveMessage: message }),

  setLastSaved: (date) =>
    set({ lastSaved: date }),

  setActiveTab: (tab) =>
    set({ activeTab: tab }),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));