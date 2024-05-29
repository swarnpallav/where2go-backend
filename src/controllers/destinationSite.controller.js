import { DestinationSite } from "../models/destinationSite.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getDestinationSiteById = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) {
		throw new ApiError(400, "id is required");
	}

	const destinationSite = await DestinationSite.findById(id).exec();

	if (!destinationSite) {
		throw new ApiError(404, "destination site not found");
	}

	return res.status(200).json(new ApiResponse(200, destinationSite));
});

const getDestinationsByCityId = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) {
		throw new ApiError(400, "id is required");
	}

	const destinations = await DestinationSite.find({ city: id })
		.populate("reviews")
		.sort({ likes: -1 })
		.exec();

	return res.status(200).json(new ApiResponse(200, destinations));
});

const like = asyncHandler(async (req, res) => {
	const { like, destinationId } = req.body;

	if (like !== true && like !== false) {
		throw new ApiError(400, "like can be either true or false");
	}

	if (!destinationId) {
		throw new ApiError(400, "destinationId is required");
	}

	const updatedDestination = await DestinationSite.findByIdAndUpdate(
		destinationId,
		{
			$inc: { likes: like ? 1 : -1 },
		},
		{ new: true }
	);

	return res
		.status(200)
		.json(new ApiResponse(200, updatedDestination, "likes updated successfully"));
});

export { getDestinationSiteById, getDestinationsByCityId, like };
