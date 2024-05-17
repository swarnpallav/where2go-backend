import { DestinationSite } from "../models/destinationSite.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
	});

	const savedDestination = await destinationSite.save();

	return res
		.status(200)
		.json(new ApiResponse(200, savedDestination, "destination site created successfully!"));
});

const getDestinationSiteById = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) {
		throw new ApiError(400, "id is required");
	}

	const destinationSite = await DestinationSite.findById(id);

	if (!destinationSite) {
		throw new ApiError(404, "destination site not found");
	}

	return res.status(200).json(new ApiResponse(200, destinationSite));
});

export { getDestinationSiteById, addDestinationSite };
