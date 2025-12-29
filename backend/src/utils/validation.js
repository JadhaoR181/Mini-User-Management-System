// Email format validation

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

//password strength requirements checking
const isStrongPassowrd = (password) => {
  //Min 8chars. 1Uppercase, 1lowercase, 1number
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  return true;
};

//password validation error messages
const getPasswordError = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
};


//full name validation 
const validateFullName = (fullName) => {
    if (!fullName || fullName.trim().length === 0) {
    return 'Full name is required';
  }
  if (fullName.trim().length < 2) {
    return 'Full name must be at least 2 characters long';
  }
  if (fullName.trim().length > 100) {
    return 'Full name must not exceed 100 characters';
  }
  return null;
};

module.exports = {
    isValidEmail,
    isStrongPassowrd,
    getPasswordError,
    validateFullName
};