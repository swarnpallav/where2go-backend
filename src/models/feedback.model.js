import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	image: {
		type: String,
	},
	text: {
		type: String,
		required: true,
	},
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);
