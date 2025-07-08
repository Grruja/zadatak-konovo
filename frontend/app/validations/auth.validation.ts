interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface RegistrationErrors {
  name?: string;
  email?: string;
  password?: string;
}

export const validateRegistration = (formData: RegistrationFormData): RegistrationErrors => {
  const errors: RegistrationErrors = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Name is required.';
  } else if (formData.name.length > 255) {
    errors.name = 'Name cannot be longer than 255 characters.';
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address.';
  } else if (formData.email.length > 255) {
    errors.email = 'Email cannot be longer than 255 characters.';
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  } else if (formData.password !== formData.password_confirmation) {
    errors.password = 'Passwords do not match.';
  }

  return errors;
};

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

export const validateLogin = (formData: LoginFormData): LoginErrors => {
  const errors: LoginErrors = {};

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required.';
  }

  return errors;
};
