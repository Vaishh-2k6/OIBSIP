require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { initializeDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a-very-secure-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/forgot-password.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Authentication API is running.' });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
