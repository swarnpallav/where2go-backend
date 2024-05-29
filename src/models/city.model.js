import mongoose, { Schema } from "mongoose";
import { arrayMinLimit } from "../utils/validation.js";

const citySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		pincode: {
			type: Number,
			required: true,
			min: 100000,
			max: 999999,
			match: [/^[1-9]{1}\d{2}\s?\d{3}$/gm, "pincode is required"],
			unique: true,
		},
		state: {
			type: Schema.Types.ObjectId,
			ref: "State",
		},
		destinations: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "DestinationSite",
				},
			],
			validate: [arrayMinLimit, "atleast one destination site is required"],
		},
	},
	{ timestamps: true }
);

export const City = mongoose.model("City", citySchema);
