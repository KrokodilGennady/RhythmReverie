const mysql = require('mysql2/promise');

// Database configuration (replace with your Laragon credentials)
const dbConfig = {
  host: 'localhost',      // Usually 'localhost' for Laragon
  user: 'root',           // Default Laragon MySQL user
  password: '',           // Default Laragon MySQL password (empty)
  database: 'rhythmreverie'  // Your database name in Laragon
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

async function getConnection() {
  return await pool.getConnection();
}

async function getUserByUsername(username) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM Users WHERE username = ?',
      [username]
    );
    connection.release();
    return rows[0]; 
  } catch (error) {
    console.error('Error getting user by username:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
}

async function createUser(username, email, passwordHash) {
  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    connection.release();
    return result.insertId; 
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function getLeaderboard() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Leaderboard');
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

async function getFriendsList(userId) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT Users.username FROM Friends JOIN Users ON Friends.friend_user_id = Users.user_id WHERE Friends.user_id = ? AND status = 1',
      [userId]
    );
    connection.release();
    return rows; // Return the list of friends (usernames)
  } catch (error) {
    console.error('Error fetching friends list:', error);
    throw error;
  }
}

async function addScore(userId, beatmapId, score, accuracy, maxCombo, mods) {
  try {
    const connection = await getConnection();
    await connection.execute(
      'INSERT INTO Scores (user_id, beatmap_id, score, accuracy, max_combo, mods) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, beatmapId, score, accuracy, maxCombo, mods]
    );
    connection.release();
  } catch (error) {
    console.error('Error adding score:', error);
    throw error;
  }
}

module.exports = {
  getConnection,
  getUserByUsername,
  createUser,
  getLeaderboard,
  getFriendsList,
  addScore
};
