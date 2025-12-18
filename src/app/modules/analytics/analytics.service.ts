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

const get_user_analytics = async (userId: string): Promise<IAnalyticsData> => {
  // Orders aggregation
  const order_stats = await Order.aggregate([
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
  const review_stats = await Review.aggregate([
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
  const wishlist_count = await Wishlist.countDocuments({ user: userId });

  // Cart count
  const cart_count = await Cart.countDocuments({ user: userId });

  // Process order status counts
  const order_status_counts: { [key: string]: number } = {};
  if (order_stats.length > 0) {
    order_stats[0].orderStatusCounts.forEach((status: string) => {
      order_status_counts[status] = (order_status_counts[status] || 0) + 1;
    });
  }

  // Process rating counts
  const rating_counts: { [key: number]: number } = {};
  if (review_stats.length > 0) {
    review_stats[0].ratingCounts.forEach((rating: number) => {
      rating_counts[rating] = (rating_counts[rating] || 0) + 1;
    });
  }

  return {
    totalOrders: order_stats[0]?.totalOrders || 0,
    completedOrders: order_stats[0]?.completedOrders || 0,
    totalSpent: order_stats[0]?.totalSpent || 0,
    totalReviews: review_stats[0]?.totalReviews || 0,
    averageRating: review_stats[0]?.averageRating || 0,
    wishlistCount: wishlist_count,
    cartCount: cart_count,
    orderStatusCounts: order_status_counts,
    ratingCounts: rating_counts,
  };
};

const get_admin_analytics = async (): Promise<IAdminAnalyticsData> => {
  // Total users
  const total_users = await User.countDocuments();

  // Total orders and revenue
  const order_stats = await Order.aggregate([
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
  const order_status_distribution: { [key: string]: number } = {};
  if (order_stats.length > 0) {
    order_stats[0].orderStatusDistribution.forEach((status: string) => {
      order_status_distribution[status] =
        (order_status_distribution[status] || 0) + 1;
    });
  }

  // Top drones
  const top_drones = await Order.aggregate([
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
  const user_growth = await User.aggregate([
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
  const revenue_over_time = await Order.aggregate([
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
    totalUsers: total_users,
    totalOrders: order_stats[0]?.totalOrders || 0,
    totalRevenue: order_stats[0]?.totalRevenue || 0,
    orderStatusDistribution: order_status_distribution,
    topDrones: top_drones,
    userGrowth: user_growth,
    revenueOverTime: revenue_over_time,
  };
};

export const AnalyticsServices = {
  get_user_analytics,
  get_admin_analytics,
};
