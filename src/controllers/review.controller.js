import { DestinationSite } from "../models/destinationSite.model.js";
import { Review } from "../models/review.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addReview = asyncHandler(async (req, res) => {
	const { text, state, city, destinationSite } = req.body;
	const { user } = req;

	if ([text, state, city, destinationSite].some(field => !field)) {
		throw new ApiError(400, "text, state, city and destination fields are required!");
	}

	let images = [];
	if (req?.files?.images?.length) {
		const imagesFilePaths = req.files.images.map(file => file.path);
		const imagesResp = await Promise.all(imagesFilePaths.map(path => uploadOnCloudinary(path)));
		images = imagesResp.map(imageObj => imageObj.url);
	}

	const review = new Review({
		text,
		state,
		city,
		destinationSite,
		images,
		isApproved: false,
		user: user._id,
	});

	const savedReview = await review.save();

	await DestinationSite.findByIdAndUpdate(destinationSite, {
		$push: { reviews: savedReview._id },
	}).exec();

	return res.status(201).json(new ApiResponse(201, savedReview, "Review added successfully!"));
});

export { addReview };
