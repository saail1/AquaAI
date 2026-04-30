export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, error: 'Email is required' };
  if (!regex.test(email)) return { valid: false, error: 'Invalid email format' };
  return { valid: true, error: null };
};

export const validatePassword = (password) => {
  if (!password) return { valid: false, error: 'Password is required', strength: 'weak' };
  if (password.length < 6) return { valid: false, error: 'Minimum 6 characters', strength: 'weak' };
  
  const hasNumbers = /\d/.test(password);
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  let strength = 'weak';
  if (password.length >= 8 && hasNumbers && hasLetters && hasSpecial) {
    strength = 'strong';
  } else if (password.length >= 6 && hasNumbers && hasLetters) {
    strength = 'medium';
  }
  
  return { valid: true, error: null, strength };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  return { valid: true, error: null };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) return { valid: false, error: 'Passwords do not match' };
  return { valid: true, error: null };
};