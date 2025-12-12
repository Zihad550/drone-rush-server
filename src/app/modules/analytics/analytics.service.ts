import mongoose from "mongoose";
import Cart from "../cart/cart.model";
import Order from "../order/order.model";
import Review from "../review/review.model";
import Wishlist from "../wishlist/wishlist.model";
import type { IAnalyticsData } from "./analytics.interface";

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

export const AnalyticsServices = {
  getUserAnalytics,
};
