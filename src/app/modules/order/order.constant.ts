import type { TOrderStatus } from "./order.interface";

export const OrderSearchableFields = ["product.name"];
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  PACKAGED: "packaged",
  DELIVERING: "delivering",
  COMPLETED: "completed",
  USER_CANCELLED: "user-cancelled",
  FAILED: "failed",
  ADMIN_CANCELLED: "admin-cancelled",
} as const;

export const OrderStatuses: TOrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "PACKAGED",
  "DELIVERING",
  "COMPLETED",
  "USER-CANCELLED",
  "FAILED",
  "ADMIN-CANCELLED",
];

export const IMMUTABLE_ORDER_STATUSES: TOrderStatus[] = [
  "COMPLETED",
  "USER-CANCELLED",
];

export const isOrderStatusImmutable = (status: TOrderStatus): boolean => {
  return IMMUTABLE_ORDER_STATUSES.includes(status);
};
