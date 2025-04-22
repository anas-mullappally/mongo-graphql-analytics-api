import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtPurchase: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    ref: "Customer",
    required: true,
  },
  products: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: (products) => products.length > 0,
      message: "At least one product is required",
    },
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "canceled"],
    default: "pending",
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
