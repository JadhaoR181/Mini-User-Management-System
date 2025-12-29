const userModel = require('../models/userModel');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { isValidEmail, getPasswordError, validateFullName } = require('../utils/validation');

//user signup/register
const signup = async(req, res) =>{
    try {
        const { email, password, fullName } = req.body;

        if(!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                error: 'Provide email, password, and full name'
            });
        }

        if(!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }
    
    
    // Validate full name
    const nameError = validateFullName(fullName);
    if (nameError) {
      return res.status(400).json({
        success: false,
        error: nameError
      });
    }

    // Validate password strength
    const passwordError = getPasswordError(password);
    if (passwordError) {
      return res.status(400).json({
        success: false,
        error: passwordError
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user (default role: user)
    const newUser = await userModel.createUser(
      email.toLowerCase(),
      passwordHash,
      fullName.trim()
    );

    // Generate JWT token
    const token = generateToken(newUser.id, newUser.email, newUser.role);

    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        role: newUser.role,
        status: newUser.status
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during signup. Please try again.'
    });
  }
};

//user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await userModel.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if user account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Your account is inactive. Please contact administrator.'
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update last login timestamp
    await userModel.updateLastLogin(user.id);

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login. Please try again.'
    });
  }
};

//get current user
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching user data'
    });
  }
};

// user logout
const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  signup,
  login,
  getCurrentUser,
  logout
};