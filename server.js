require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Проверка существования index.html
try {
  fs.accessSync(path.join(__dirname, 'index.html'));
} catch (err) {
  console.error('ERROR: index.html not found in project root!');
  process.exit(1);
}

// Раздача статики из корня
app.use(express.static(__dirname));

// Безопасный catch-all роут
app.get(/^\/(?!api).*/, (req, res) => { // Исключаем /api/ маршруты
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) res.status(500).send('Error loading page');
  });
});

// API роуты
app.post('/faucet', async (req, res) => {
  // ... ваш код ...
});

app.get('/balance', async (req, res) => {
  // ... ваш код ...
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
