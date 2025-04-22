import Order from "../models/Order.js";
// import crypto from "crypto";

export const getCustomerSpending = async ({ customerId }) => {
  const data = await Order.aggregate([
    { $match: { customerId, status: "completed" } },
    {
      $group: {
        _id: "$customerId",
        totalSpent: { $sum: "$totalAmount" },
        averageOrderValue: { $avg: "$totalAmount" },
        lastOrderDate: { $max: "$orderDate" },
      },
    },
  ]);

  if (data.length === 0) {
    return {
      customerId,
      totalSpent: 0,
      averageOrderValue: 0,
      lastOrderDate: null,
    };
  }

  return {
    customerId,
    totalSpent: data[0].totalSpent,
    averageOrderValue: data[0].averageOrderValue,
    lastOrderDate: data[0].lastOrderDate.toISOString(),
  };
};

export const getTopSellingProducts = async ({ limit }) => {
  const result = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        totalSold: { $sum: "$products.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        productId: "$_id",
        name: "$product.name",
        totalSold: 1,
        _id: 0,
      },
    },
  ]);

  return result;
};

export const getSalesAnalytics = async ({ startDate, endDate }) => {
  const result = await Order.aggregate([
    {
      $match: {
        status: "completed",
        orderDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $facet: {
        total: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              completedOrders: { $sum: 1 },
            },
          },
        ],
        categoryBreakdown: [
          { $unwind: "$products" },
          {
            $lookup: {
              from: "products",
              localField: "products.productId",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          { $unwind: "$productInfo" },
          {
            $group: {
              _id: "$productInfo.category",
              revenue: {
                $sum: {
                  $multiply: [
                    "$products.quantity",
                    "$products.priceAtPurchase",
                  ],
                },
              },
            },
          },
          {
            $project: {
              category: "$_id",
              revenue: 1,
              _id: 0,
            },
          },
        ],
      },
    },
  ]);

  const total = result[0].total[0] || { totalRevenue: 0, completedOrders: 0 };
  const categoryBreakdown = result[0].categoryBreakdown;

  return {
    totalRevenue: total.totalRevenue,
    completedOrders: total.completedOrders,
    categoryBreakdown,
  };
};

// export const getCustomerOrders = async ({ customerId, page, limit }) => {
//   const skip = (page - 1) * limit;

//   const [orders, total] = await Promise.all([
//     Order.find({ customerId }).sort({ orderDate: -1 }).skip(skip).limit(limit),
//     Order.countDocuments({ customerId }),
//   ]);

//   return {
//     orders,
//     total,
//     page,
//     limit,
//   };
// };

// export const placeOrder = async ({ input }) => {
//   const newOrder = await Order.create({
//     _id: crypto.randomUUID(), // UUID as _id
//     customerId: input.customerId,
//     products: input.products,
//     totalAmount: input.totalAmount,
//     orderDate: new Date(input.orderDate),
//     status: input.status || "pending",
//   });

//   return newOrder;
// };

export default {
  Query: {
    getCustomerSpending,
    getTopSellingProducts,
    getSalesAnalytics,
    // getCustomerOrders,
  }
};
