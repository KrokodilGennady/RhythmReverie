const express = require('express');
const session = require('express-session');
const db = require('./db');
const bcrypt = require('bcrypt'); // Для хеширования паролей

const app = express();
const port = 3000;

app.set('view engine', 'ejs'); // Используем EJS для шаблонов
app.use(express.urlencoded({ extended: true })); // Для парсинга форм
app.use(express.static('public')); // Для статических файлов (css, js)

app.use(session({
  secret: 'your_secret_key', // Замените на свой секретный ключ
  resave: false,
  saveUninitialized: true
}));

// Маршрут для страницы логина
app.get('/login', (req, res) => {
  res.render('login');
});

// Маршрут для обработки логина
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [user] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);

    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.render('login', { error: 'Неверное имя пользователя или пароль' });
    }

    req.session.userId = user.user_id;
    res.redirect('/'); // Перенаправляем на главную страницу после успешного входа
  } catch (err) {
    console.error('Ошибка при логине:', err);
    res.render('login', { error: 'Произошла ошибка' });
  }
});

// Маршрут для страницы регистрации
app.get('/register', (req, res) => {
    res.render('register');
  });
  
  // Маршрут для обработки регистрации
  app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Хеширование пароля
  
      await db.query(
        'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
  
      res.redirect('/login'); // Перенаправляем на страницу входа после успешной регистрации
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      res.render('register', { error: 'Произошла ошибка' });
    }
  });
  
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${5500}`);
});
