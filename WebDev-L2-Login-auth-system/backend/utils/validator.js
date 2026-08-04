function sanitizeInput(value) {
  return String(value || '').trim().replace(/[<>]/g, '');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegisterInput({ username, email, password, confirmPassword }) {
  const errors = {};
  const sanitizedUsername = sanitizeInput(username);
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPassword = sanitizeInput(password);
  const sanitizedConfirmPassword = sanitizeInput(confirmPassword);

  if (!sanitizedUsername) {
    errors.username = 'Username is required';
  } else if (sanitizedUsername.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  const normalizedEmail = sanitizedEmail.toLowerCase();

  if (!sanitizedEmail) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(sanitizedEmail)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!sanitizedPassword) {
    errors.password = 'Password is required';
  } else {
    if (sanitizedPassword.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!/\d/.test(sanitizedPassword)) {
      errors.password = 'Password must include at least one number';
    }
  }

  if (!sanitizedConfirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (sanitizedPassword !== sanitizedConfirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    errors,
    values: {
      username: sanitizedUsername,
      email: normalizedEmail,
      password: sanitizedPassword,
      confirmPassword: sanitizedConfirmPassword,
    },
  };
}

function validateLoginInput({ identifier, password }) {
  const errors = {};
  const sanitizedIdentifier = sanitizeInput(identifier);
  const normalizedIdentifier = sanitizedIdentifier.includes('@')
    ? sanitizedIdentifier.toLowerCase()
    : sanitizedIdentifier;
  const sanitizedPassword = sanitizeInput(password);

  if (!sanitizedIdentifier) {
    errors.identifier = 'Please enter your email or username';
  }

  if (!sanitizedPassword) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    values: {
      identifier: normalizedIdentifier,
      password: sanitizedPassword,
    },
  };
}

module.exports = { validateRegisterInput, validateLoginInput };
