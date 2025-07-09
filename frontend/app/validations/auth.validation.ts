interface LoginFormData {
  username: string;
  password: string;
}

interface LoginErrors {
  username?: string;
  password?: string;
}

export const validateLogin = (formData: LoginFormData): LoginErrors => {
  const errors: LoginErrors = {};

  if (!formData.username.trim()) {
    errors.username = 'Username is required.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  }

  return errors;
};
