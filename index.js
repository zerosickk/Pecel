// index.js
const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 5, // max 5 requests per menit
  message: `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Rate Limit - Pecel Lele</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="login-container">
        <div class="logo">😜</div>
        <h1>Terlalu Banyak Percobaan</h1>
        <div class="rate-limit-message">
          <p>⏰ Anda telah mencoba login terlalu banyak kali.</p>
          <p>Silakan tunggu <strong>1 menit</strong> sebelum mencoba lagi.</p>
        </div>
        <div class="countdown" id="countdown">
          <p>Waktu tersisa: <span id="timer">60</span> detik</p>
        </div>
        <a href="/" class="back-btn" id="backBtn" style="display:none;">Kembali ke Login</a>
      </div>
      
      <script>
        let timeLeft = 60;
        const timer = document.getElementById('timer');
        const backBtn = document.getElementById('backBtn');
        
        const countdown = setInterval(() => {
          timeLeft--;
          timer.textContent = timeLeft;
          
          if (timeLeft <= 0) {
            clearInterval(countdown);
            document.getElementById('countdown').style.display = 'none';
            backBtn.style.display = 'inline-block';
          }
        }, 1000);
      </script>
    </body>
    </html>
  `
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'pecel_lele_secret',
  resave: false,
  saveUninitialized: true
}));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/login', limiter, (req, res) => {
  const { username, password } = req.body;

  // Cek kredensial
  if (username === correctUser && password === correctPass) {
    req.session.loggedIn = true;
    return res.redirect('/dashboard');
  }

  return res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Login Gagal - Pecel Lele</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="login-container">
        <div class="logo">😜</div>
        <h1>Login Gagal</h1>
        <div class="error-message">
          <p> Username atau password salah!</p>
          <p>Silakan coba lagi dengan kredensial yang benar.</p>
        </div>
        <a href="/" class="back-btn">Kembali ke Login</a>
      </div>
    </body>
    </html>
  `);
});

app.get('/dashboard', (req, res) => {
  if (req.session.loggedIn) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Admin Dashboard Pecel</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <div class="dashboard-container">
          <div class="dashboard-header">
            <h1>Dashboard Admin Pecel Lele</h1>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📋</div>
              <div class="stat-number">42</div>
              <div class="stat-label">Jumlah Pesanan</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-number">Rp850.000</div>
              <div class="stat-label">Pendapatan Hari Ini</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔥</div>
              <div class="stat-number">Lele Bakar</div>
              <div class="stat-label">Menu Terlaris</div>
            </div>
          </div>

          <div class="welcome-card">
            <h2>Selamat Datang, Mamat!</h2>
            <p>Dashboard ini menampilkan statistik warung pecel lele hari ini. Semua data telah diperbarui secara real-time untuk membantu Anda memantau performa bisnis.</p>
          </div>
        </div>
      </body>
      </html>
    `);
  }
  return res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server pecel lele jalan di http://localhost:${PORT}`);
});
