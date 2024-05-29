import { Feedback } from "../models/feedback.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const save = asyncHandler(async (req, res) => {
	const { user } = req;

	const { text } = req.body;

	if (!text) {
		throw new ApiError(400, "text is required");
	}

	const imageLocalPath = req?.file?.path;
	let image;

	if (imageLocalPath) {
		image = await uploadOnCloudinary(imageLocalPath);
	}

	const feedback = new Feedback({ userId: user._id, text, image: image?.url });

	const savedFeedback = await feedback.save();

	return res.status(201).json(new ApiResponse(201, savedFeedback, "feedback saved successfully"));
});

export { save };
