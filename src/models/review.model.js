import mongoose, { Schema } from "mongoose";
import { arrayMaxLimit } from "../utils/validation.js";

const reviewSchema = new Schema(
	{
		text: {
			type: String,
			required: [true, "review text is required"],
		},
		images: {
			type: [String],
			validate: [arrayMaxLimit, "number of images can not exceed 10"],
		},
		state: {
			type: Schema.Types.ObjectId,
			ref: "State",
			required: [true, "state is required"],
		},
		city: {
			type: Schema.Types.ObjectId,
			ref: "City",
			required: [true, "city is required"],
		},
		destinationSite: {
			type: Schema.Types.ObjectId,
			ref: "DestinationSite",
			required: [true, "destination site is required"],
		},
		isApproved: {
			type: Boolean,
			default: false,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "user is required"],
		},
	},
	{ timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
