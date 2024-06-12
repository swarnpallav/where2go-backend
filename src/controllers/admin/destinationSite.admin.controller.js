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

const destinationListing = asyncHandler(async (req, res) => {
	const { limit = 10, page = 1 } = req.query;

	const destinations = await DestinationSite.aggregate([
		{
			$lookup: {
				from: "cities",
				localField: "city",
				foreignField: "_id",
				as: "city",
			},
		},
		{ $unwind: "$city" },
		{
			$project: {
				name: 1,
				city: "$city.name",
				createdAt: 1,
				updatedAt: 1,
			},
		},
		{ $skip: limit * (page - 1) },
		{ $limit: limit },
	]);

	if (!destinations.length) {
		throw new ApiError(500, "Unable to retrieve destinations data");
	}

	return res.status(200).json(new ApiResponse(200, destinations));
});

const getOrphanDestinations = asyncHandler(async (_, res) => {
	const destinations = await DestinationSite.find(
		{ city: { $exists: false } },
		{
			name: 1,
			createdAt: 1,
			updatedAt: 1,
			likes: 1,
		}
	);

	return res.status(200).json(new ApiResponse(200, destinations));
});

export { addDestinationSite, destinationListing, getOrphanDestinations };
