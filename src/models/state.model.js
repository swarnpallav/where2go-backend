import mongoose, { Schema } from "mongoose";
import { arrayMinLimit } from "../utils/validation.js";

const stateSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "State name is required."],
		},
		cities: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "City",
				},
			],
			validate: [arrayMinLimit, "atleast one city is required "],
		},
	},
	{ timestamps: true }
);

export const State = mongoose.model("State", stateSchema);
