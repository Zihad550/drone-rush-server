import mongoose from "mongoose";
import Cart from "../cart/cart.model";
import Order from "../order/order.model";
import Review from "../review/review.model";
import User from "../user/user.model";
import Wishlist from "../wishlist/wishlist.model";
import type {
  IAdminAnalyticsData,
  IAnalyticsData,
} from "./analytics.interface";

const getUserAnalytics = async (userId: string): Promise<IAnalyticsData> => {
  // Orders aggregation
  const orderStats = await Order.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        completedOrders: {
          $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
        },
        totalSpent: {
          $sum: {
            $cond: [{ $eq: ["$status", "COMPLETED"] }, "$totalPrice", 0],
          },
        },
        orderStatusCounts: {
          $push: "$status",
        },
      },
    },
  ]);

  // Reviews aggregation
  const reviewStats = await Review.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
        ratingCounts: { $push: "$rating" },
      },
    },
  ]);

  // Wishlist count
  const wishlistCount = await Wishlist.countDocuments({ user: userId });

  // Cart count
  const cartCount = await Cart.countDocuments({ user: userId });

  // Process order status counts
  const orderStatusCounts: { [key: string]: number } = {};
  if (orderStats.length > 0) {
    orderStats[0].orderStatusCounts.forEach((status: string) => {
      orderStatusCounts[status] = (orderStatusCounts[status] || 0) + 1;
    });
  }

  // Process rating counts
  const ratingCounts: { [key: number]: number } = {};
  if (reviewStats.length > 0) {
    reviewStats[0].ratingCounts.forEach((rating: number) => {
      ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    });
  }

  return {
    totalOrders: orderStats[0]?.totalOrders || 0,
    completedOrders: orderStats[0]?.completedOrders || 0,
    totalSpent: orderStats[0]?.totalSpent || 0,
    totalReviews: reviewStats[0]?.totalReviews || 0,
    averageRating: reviewStats[0]?.averageRating || 0,
    wishlistCount,
    cartCount,
    orderStatusCounts,
    ratingCounts,
  };
};

const getAdminAnalytics = async (): Promise<IAdminAnalyticsData> => {
  // Total users
  const totalUsers = await User.countDocuments();

  // Total orders and revenue
  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: {
          $sum: {
            $cond: [{ $eq: ["$status", "COMPLETED"] }, "$totalPrice", 0],
          },
        },
        orderStatusDistribution: { $push: "$status" },
      },
    },
  ]);

  // Process order status distribution
  const orderStatusDistribution: { [key: string]: number } = {};
  if (orderStats.length > 0) {
    orderStats[0].orderStatusDistribution.forEach((status: string) => {
      orderStatusDistribution[status] =
        (orderStatusDistribution[status] || 0) + 1;
    });
  }

  // Top drones
  const topDrones = await Order.aggregate([
    { $unwind: "$drones" },
    {
      $group: {
        _id: "$drones.drone",
        salesCount: { $sum: "$drones.quantity" },
      },
    },
    { $sort: { salesCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "drones",
        localField: "_id",
        foreignField: "_id",
        as: "drone",
      },
    },
    { $unwind: "$drone" },
    {
      $project: {
        droneId: "$_id",
        name: "$drone.name",
        salesCount: 1,
      },
    },
  ]);

  // User growth (by month)
  const userGrowth = await User.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ]);

  // Revenue over time (by month, completed orders)
  const revenueOverTime = await Order.aggregate([
    { $match: { status: "COMPLETED" } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
        amount: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        amount: 1,
        _id: 0,
      },
    },
  ]);

  return {
    totalUsers,
    totalOrders: orderStats[0]?.totalOrders || 0,
    totalRevenue: orderStats[0]?.totalRevenue || 0,
    orderStatusDistribution,
    topDrones,
    userGrowth,
    revenueOverTime,
  };
};

export const AnalyticsServices = {
  getUserAnalytics,
  getAdminAnalytics,
};
