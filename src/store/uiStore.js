import { create } from 'zustand';

export const useUiStore = create((set) => ({
  toast: { 
    visible: false, 
    message: '', 
    type: 'info' // 'info', 'success', 'error'
  },
  isCustomModalOpen: false,
  activeTab: 'home',

  // Auto-hiding toast notification
  showToast: (message, type = 'info') => {
    set({ toast: { visible: true, message, type } });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toast: { ...state.toast, visible: false }
      }));
    }, 3000);
  },
  
  hideToast: () => set((state) => ({ 
    toast: { ...state.toast, visible: false } 
  })),

  toggleCustomModal: (isOpen) => set({ isCustomModalOpen: isOpen }),
  
  setActiveTab: (tab) => set({ activeTab: tab })
}));