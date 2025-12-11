import { model, Schema } from "mongoose";
import { PAYMENT_METHODS } from "./shippingInformation.constant";
import type IShippingInfo from "./shippingInformation.interface";

const shippingInformationSchema = new Schema<IShippingInfo>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		street: {
			type: String,
			required: true,
		},
		apt: {
			type: String,
		},
		country: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		zipCode: {
			type: String,
			required: true,
		},
		paymentMethod: {
			type: String,
			enum: PAYMENT_METHODS,
			default: "COD",
		},
	},
	{
		timestamps: true,
	},
);

const ShippingInformation = model<IShippingInfo>(
	"ShippingInformation",
	shippingInformationSchema,
	"shipping_information",
);

export default ShippingInformation;
