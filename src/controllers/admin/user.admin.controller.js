import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const markAsAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) {
		throw new ApiError(400, "id is required");
	}

	const updatedUser = await User.findByIdAndUpdate(
		id,
		{ $set: { isAdmin: true } },
		{ new: true }
	).exec();

	res
		.status(200)
		.json(new ApiResponse(200, { userId: updatedUser._id, isAdmin: updatedUser.isAdmin }));
});

export { markAsAdmin };
