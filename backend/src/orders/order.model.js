const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      city: {
        type: String,
        required: true,
      },
      country: String,
      state: String,
      zipcode: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    productIds: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'canceled'], // Chỉ cho phép 3 trạng thái này
      default: 'pending', // Mặc định khi tạo đơn là pending
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
