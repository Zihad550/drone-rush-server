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

export interface ITopDrone {
  droneId: string;
  name: string;
  salesCount: number;
}

export interface IGrowthData {
  date: string;
  count: number;
}

export interface IRevenueData {
  date: string;
  amount: number;
}

export interface IAdminAnalyticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  orderStatusDistribution: { [key: string]: number };
  topDrones: ITopDrone[];
  userGrowth: IGrowthData[];
  revenueOverTime: IRevenueData[];
}
