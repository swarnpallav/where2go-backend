import { DestinationSite } from "../../models/destinationSite.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const addDestinationSite = asyncHandler(async (req, res) => {
	const { name, description, openingTime, closingTime, directions } = req.body;

	if ([name, description].some(field => field.trim() === "")) {
		throw new ApiError(400, "name and description are required");
	}

	let images = [];
	if (req.files.images && req.files.images.length) {
		const imagesFilePaths = req.files.images.map(file => file.path);
		const imagesResp = await Promise.all(imagesFilePaths.map(path => uploadOnCloudinary(path)));
		images = imagesResp.map(imageObj => imageObj.url);
	}

	const destinationSite = new DestinationSite({
		name,
		description,
		images,
		openingTime,
		closingTime,
		directions,
		reviews: [],
	});

	const savedDestination = await destinationSite.save();

	return res
		.status(200)
		.json(new ApiResponse(200, savedDestination, "destination site created successfully!"));
});

export { addDestinationSite };