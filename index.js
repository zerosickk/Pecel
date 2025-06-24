require('dotenv').config();
const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

const correctUser = process.env.ADMIN_USER;
const correctPass = process.env.ADMIN_PASS;

app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === correctUser && password === correctPass) {
    req.session.loggedIn = true;
    return res.send('Login berhasil!');
  }
  return res.send('Gagal login.');
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
