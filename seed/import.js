import mongoose from "mongoose";
import dotenv from "dotenv";
import csv from "csvtojson";
import Customer from "../src/models/Customer.js";
import Product from "../src/models/Product.js";
import Order from "../src/models/Order.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    const rawCustomers = await csv().fromFile(
      path.join(__dirname, "customers.csv")
    );
    const rawProducts = await csv().fromFile(
      path.join(__dirname, "products.csv")
    );
    const rawOrders = await csv().fromFile(path.join(__dirname, "orders.csv"));

    await Customer.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const customers = rawCustomers.map((customer) => ({
      id: customer._id,
      name: customer.name,
      email: customer.email,
      age: customer.age,
      location: customer.location,
      gender: customer.gender,
    }));

    const products = rawProducts.map((product) => ({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    }));

    const insertedCustomers = await Customer.insertMany(customers);
    const insertedProducts = await Product.insertMany(products);

    const orders = [];
    for (const order of rawOrders) {
      try {
        let productsString = order.products;

        productsString = productsString
          .replace(/'/g, '"')
          .replace(/\\"/g, '"')
          .replace(/(\w+):/g, '"$1":');

        let productsData;
        try {
          productsData = JSON.parse(productsString);
        } catch (parseError) {
          console.error(
            `Failed to parse products for order ${order._id}:`,
            productsString
          );
          console.error("Parse error:", parseError.message);
          continue;
        }

        if (!Array.isArray(productsData)) {
          console.error(
            `Products data is not an array for order ${order._id}:`,
            productsData
          );
          continue;
        }

        const customerDetails = await Customer.findOne({
          id: order.customerId,
        }).select("_id");

        if (!customerDetails) {
          console.error(`Customer not found for order ${order._id}`);
          continue;
        }

        const products = [];
        for (const product of productsData) {
          try {
            if (
              !product.productId ||
              !product.quantity ||
              !product.priceAtPurchase
            ) {
              console.error(
                `Invalid product structure in order ${order._id}:`,
                product
              );
              continue;
            }

            const productDetails = await Product.findOne({
              id: product.productId,
            }).select("_id");

            if (!productDetails) {
              console.error(
                `Product not found: ${product.productId} in order ${order._id}`
              );
              continue;
            }

            products.push({
              productId: productDetails._id,
              quantity: product.quantity,
              priceAtPurchase: product.priceAtPurchase,
            });
          } catch (productError) {
            console.error(
              `Error processing product ${product.productId}:`,
              productError.message
            );
          }
        }

        orders.push({
          customerId: customerDetails._id,
          products,
          totalAmount: order.totalAmount,
          orderDate: order.orderDate,
          status: order.status,
        });
      } catch (orderError) {
        console.error(
          `Error processing order ${order._id}:`,
          orderError.message
        );
      }
    }

    try {
      const insertedOrders = await Order.insertMany(orders);
      console.log(`Successfully inserted ${insertedOrders.length} orders`);
    } catch (insertError) {
      console.error("Error inserting orders:", insertError.message);
    }

    console.log("✅ Seed data imported");
    process.exit();
  } catch (err) {
    console.error("Error importing data:", err);
    process.exit(1);
  }
};

await connectDB();
await importData();
