import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
	{
		text: {
			type: String,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		replies: [
			{
				type: Schema.Types.ObjectId,
				ref: "Message",
			},
		],
	},
	{ timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
