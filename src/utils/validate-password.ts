export const validatePassword = (value: string): string | null => {
  if (!value || value.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[0-9]/.test(value)) {
    return "Password must contain at least one number";
  }

  return null;
};