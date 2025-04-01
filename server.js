require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { ethers } = require('ethers');
const fs = require('fs'); // Добавляем модуль для проверки файлов

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Проверяем существование index.html в корне
const indexPath = path.join(__dirname, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found in project root!');
  process.exit(1);
}

// Раздаём статику из корня проекта
app.use(express.static(__dirname));

// Все GET-запросы перенаправляем на index.html
app.get('*', (req, res) => {
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Server error - index.html not found');
    }
  });
});

// Ваши API-роуты
app.post('/faucet', async (req, res) => {
  // ... ваш код faucet ...
});

app.get('/balance', async (req, res) => {
  // ... ваш код получения баланса ...
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving index.html from: ${indexPath}`);
});