import mongoose, { Schema } from "mongoose";
import { arrayMaxLimit } from "../utils/validation.js";

const destinationSiteSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "name is required"],
		},
		description: {
			type: String,
			required: [true, "description is required"],
		},
		images: {
			type: [String],
			validate: [arrayMaxLimit, "number of images can not exceed 10"],
		},
		openingTime: {
			type: Date,
		},
		closingTime: {
			type: Date,
		},
		directions: {
			type: String,
		},
		city: {
			type: Schema.Types.ObjectId,
			ref: "City",
		},
	},
	{ timestamps: true }
);

export const DestinationSite = mongoose.model("DestinationSite", destinationSiteSchema);
