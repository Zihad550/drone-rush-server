export interface IAnalyticsData {
  totalOrders: number;
  completedOrders: number;
  totalSpent: number;
  totalReviews: number;
  averageRating: number;
  wishlistCount: number;
  cartCount: number;
  orderStatusCounts: { [key: string]: number };
  ratingCounts: { [key: number]: number };
}
