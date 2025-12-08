import type { TOrderStatus } from "./order.interface";

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
	"PENDING",
	"PROCESSING",
	"PACKAGED",
	"DELIVERING",
	"COMPLETED",
	"USER-CANCELLED",
	"FAILED",
	// "ADMIN-CANCELLED",
];
