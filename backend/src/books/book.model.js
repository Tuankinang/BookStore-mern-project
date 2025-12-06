const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    trending: {
      type: Boolean,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: true,
    },
    newPrice: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    stock: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0 // Mặc định ban đầu chưa bán được cuốn nào
    }
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
