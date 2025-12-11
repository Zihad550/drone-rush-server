import { model, Schema } from "mongoose";
import type IDrone from "./drone.interface";

const droneSchema = new Schema<IDrone>(
	{
		name: {
			type: String,
			required: true,
		},
		img: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: "Review",
			},
		],
		brand: {
			type: Schema.Types.ObjectId,
			ref: "Brand",
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Drone = model<IDrone>("Drone", droneSchema);

export default Drone;
