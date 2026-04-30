import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { onAuthChange, loginWithEmail, signupWithEmail, logout as firebaseLogout } from '../services/firebase/auth';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Subscribe to Firebase auth state changes automatically
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        clearUser();
      }
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const { error } = await loginWithEmail(email, password);
    setLoading(false);
    return { success: !error, error };
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    const { error } = await signupWithEmail(email, password, name);
    setLoading(false);
    return { success: !error, error };
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await firebaseLogout();
    setLoading(false);
    return { success: !error, error };
  };

  return { user, isAuthenticated, isLoading, login, signup, logout };
};