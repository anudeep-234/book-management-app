const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookdb';

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use('/api/books', booksRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    status = 400;
  } else if (err.code === 11000) {
    status = 409;
    message = 'A book with this ISBN already exists';
  }

  if (status === 500) console.error(err);
  res.status(status).json({ error: message });
});

async function start() {
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB');
      break;
    } catch (err) {
      console.log(`MongoDB connection attempt ${attempt} failed: ${err.message}`);
      if (attempt === 10) process.exit(1);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
