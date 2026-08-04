const bcrypt = require('bcrypt');
const { createUser, findUserByUsernameOrEmail, findUserById } = require('../models/userModel');
const { validateRegisterInput, validateLoginInput } = require('../utils/validator');

async function register(req, res) {
  const { errors, values } = validateRegisterInput(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const existingUsername = await findUserByUsernameOrEmail(values.username);
    const existingEmail = await findUserByUsernameOrEmail(values.email);

    if (existingUsername || existingEmail) {
      return res.status(409).json({
        success: false,
        errors: {
          general: 'An account with that email or username already exists',
        },
      });
    }

    const passwordHash = await bcrypt.hash(values.password, 10);
    await createUser({
      username: values.username,
      email: values.email,
      passwordHash,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, errors: { general: 'Registration failed' } });
  }
}

async function login(req, res) {
  const { errors, values } = validateLoginInput(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const user = await findUserByUsernameOrEmail(values.identifier);
    if (!user) {
      return res.status(401).json({
        success: false,
        errors: {
          general: 'Invalid username/email or password',
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(values.password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        errors: {
          general: 'Invalid username/email or password',
        },
      });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.email = user.email;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, errors: { general: 'Login failed' } });
  }
}

async function dashboard(req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const user = await findUserById(req.session.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user,
      session: {
        createdAt: req.session.createdAt || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ success: false, message: 'Unable to load dashboard' });
  }
}

function logout(req, res) {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }

    res.clearCookie('connect.sid');
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
}

module.exports = { register, login, dashboard, logout };
