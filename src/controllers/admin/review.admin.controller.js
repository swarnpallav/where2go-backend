import { reviewStatuses } from "../../contants.js";
import { Review } from "../../models/review.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const verifyReview = asyncHandler(async (req, res) => {
	const { id, remarks, status } = req.body;
	const { user } = req.user;

	if (!id) {
		throw new ApiError(400, "review id is required");
	}

	if (!reviewStatuses[status]) {
		throw new ApiError(400, "status can be PENDING, APPROVED or REJECTED");
	}

	if (status === reviewStatuses.REJECTED && !remarks) {
		throw new ApiError(400, "remarks is required if review is rejected");
	}

	const review = await Review.findById(id).exec();

	if (review) {
		throw new ApiError(404, "review not found!");
	}

	const updatedReview = await Review.findByIdAndUpdate(id, {
		$set: {
			status,
			remarks,
			validatedBy: user._id,
		},
	});

	return res.status(200).json(new ApiResponse(200, updatedReview, "review verification done"));
});

export { verifyReview };
