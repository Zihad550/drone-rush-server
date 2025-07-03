import { TOrderStatus } from "./drOrder.interface";

export const OrderSearchableFields = ["product.name"];
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  PACKAGED: "packaged",
  DELIVERING: "delivering",
  COMPLETED: "completed",
  USER_CANCELLED: "user-cancelled",
  ADMIN_CANCELLED: "admin-cancelled",
} as const;

export const OrderStatuses: TOrderStatus[] = [
  "pending",
  "processing",
  "packaged",
  "delivering",
  "completed",
  "user-cancelled",
  "admin-cancelled",
];
