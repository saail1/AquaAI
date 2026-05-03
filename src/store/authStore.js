import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  clearUser: () => set({ user: null, token: null, isAuthenticated: false }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));