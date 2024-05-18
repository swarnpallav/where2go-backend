import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addMessage = asyncHandler(async (req, res) => {
	const { id, body } = req.body;
	const { user: owner } = req;

	if (!body) {
		throw new ApiError(400, "message body is required");
	}

	if (!body.text) {
		throw new ApiError(400, "message text is required");
	}

	if (id) {
		const repliedTo = await Message.findById(id).exec();

		if (!repliedTo) {
			throw new ApiError(404, "parent message not found");
		}

		const ownerNameObj = await User.findOne(repliedTo.owner._id, { email: 1 });

		const newMessage = new Message({
			body: {
				repliedTo: {
					userId: repliedTo.owner._id,
					name: ownerNameObj.email,
				},
				text: body.text,
			},
			owner: owner._id,
		});

		if (repliedTo.parent) {
			newMessage.parent = repliedTo.parent;
			const savedMessage = await newMessage.save();
			await Message.updateOne({ _id: repliedTo.parent }, { $push: { replies: newMessage._id } });

			return res
				.status(201)
				.json(new ApiResponse(201, savedMessage, "Message created successfully"));
		}
		newMessage.parent = id;
		repliedTo.replies.push(newMessage);
		const savedMessage = await newMessage.save();
		await repliedTo.save();

		return res.status(201).json(new ApiResponse(201, savedMessage, "Message created successfully"));
	}

	const message = new Message({
		body,
		owner: owner._id,
	});

	const savedMessage = await message.save();

	return res.status(201).json(new ApiResponse(201, savedMessage, "Message added successfully!"));
});

export { addMessage };
