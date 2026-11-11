const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, trim: true, unique: true, sparse: true },
    genre: { type: String, trim: true, default: 'Uncategorized' },
    publishedYear: {
      type: Number,
      min: 0,
      max: new Date().getFullYear() + 1
    },
    status: {
      type: String,
      enum: ['to-read', 'reading', 'finished'],
      default: 'to-read'
    },
    rating: { type: Number, min: 1, max: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
