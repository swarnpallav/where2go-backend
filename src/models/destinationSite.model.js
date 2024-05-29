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
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: "Review",
			},
		],
		likes: {
			type: Number,
			default: 0,
			min: 0,
		},
		location: {
			type: {
				type: String,
				enum: ["Point"],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
	},
	{ timestamps: true }
);

export const DestinationSite = mongoose.model("DestinationSite", destinationSiteSchema);
