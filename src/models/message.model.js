import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
	{
		body: {
			repliedTo: {
				userId: {
					type: Schema.Types.ObjectId,
					ref: "User",
				},
				name: String,
			},
			text: String,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		parent: {
			type: Schema.Types.ObjectId,
			ref: "Message",
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
