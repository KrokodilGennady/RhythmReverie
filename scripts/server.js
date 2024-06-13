const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./db');

const app = express();
const port = 3088; // Or your preferred port

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing JSON data
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration (adjust settings as needed)
app.use(
  session({
    secret: 'pixel', 
    resave: false,
    saveUninitialized: false,
  })
);

// Authentication middleware
function authMiddleware(req, res, next) {
  if (req.session.userId) {
    next(); 
  } else {
    res.redirect('/login'); 
  }
}

// Routes

// GET /login: Render the login form
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /login: Handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    req.session.userId = user.user_id;
    res.redirect('/'); 
  } catch (error) {
    console.error('Error during login:', error);
    res.render('login', { error: 'An error occurred during login' });
  }
});

// GET /register: Render the registration form
app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// POST /register: Handle registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    await db.createUser(username, email, hashedPassword);

    res.redirect('/login'); 
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// GET /leaderboard: Render the leaderboard (protected route)
app.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const leaderboardData = await db.getLeaderboard();
    res.render('leaderboard', { leaderboard: leaderboardData });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).send('Error fetching leaderboard');
  }
});

// GET /friends: Render the friends list (protected route)
app.get('/friends', authMiddleware, async (req, res) => {
  try {
    const userId = req.session.userId;
    const friendsList = await db.getFriendsList(userId);
    res.render('friends', { friends: friendsList });
  } catch (error) {
    console.error('Error fetching friends list:', error);
    res.status(500).send('Error fetching friends list');
  }
});

// POST /scores: Handle score submission (protected route)
app.post('/scores', authMiddleware, express.json(), async (req, res) => {
  const { beatmapId, score, accuracy, maxCombo, mods } = req.body;
  const userId = req.session.userId;

  try {
    await db.addScore(userId, beatmapId, score, accuracy, maxCombo, mods);
    res.sendStatus(200); // OK
  } catch (error) {
    console.error('Error adding score:', error);
    res.status(500).send('Error adding score');
  }
});

// GET /logout: Handle logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => { // Destroy the session
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login'); // Redirect to login after logout
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${8080}`);
});
