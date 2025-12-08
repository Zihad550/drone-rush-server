import { model, Schema } from "mongoose";
import type ICart from "./drCart.interface";

const cartSchema = new Schema<ICart>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "drUser",
			required: true,
		},
		product: {
			type: Schema.Types.ObjectId,
			ref: "drProduct",
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			default: 1,
			min: 1,
		},
	},
	{
		timestamps: { createdAt: "addedAt", updatedAt: true },
	},
);

// Compound unique index to prevent duplicate user-product pairs
cartSchema.index({ user: 1, product: 1 }, { unique: true });

const Cart = model<ICart>("Cart", cartSchema);

export default Cart;
