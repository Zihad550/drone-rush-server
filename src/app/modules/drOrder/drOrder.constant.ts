import { TOrderStatus } from "./drOrder.interface";

export const OrderSearchableFields = ["product.name"];
export const OrderStatuses: TOrderStatus[] = [
  "processing",
  "packaged",
  "delivered",
  "completed",
  "buyer-cancelled",
  "seller-cancelled",
];
