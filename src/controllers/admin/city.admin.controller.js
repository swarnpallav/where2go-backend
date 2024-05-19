import { City } from "../../models/city.model.js";
import { DestinationSite } from "../../models/destinationSite.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addCity = asyncHandler(async (req, res) => {
	const { name, pincode, destinations } = req.body;

	if (!name || !pincode) {
		throw new ApiError(400, "name and pincode fields are required!");
	}

	if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
		return new ApiError(400, "At least one destination is required");
	}

	const existingCity = await City.findOne({ pincode });

	if (existingCity) {
		throw new ApiError(409, `city with ${pincode} already exists`);
	}

	const city = new City({
		name,
		pincode,
		destinations,
	});

	const savedCity = await city.save();

	await DestinationSite.updateMany(
		{ _id: { $in: destinations } },
		{ $set: { city: savedCity._id } }
	);

	return res.status(200).json(new ApiResponse(200, savedCity, "City created successfully"));
});

const addDestination = asyncHandler(async (req, res) => {
	const { cityId, destinationId } = req.body;

	if (!cityId || !destinationId) {
		throw new ApiError(400, "cityId and destinationId fields are required");
	}

	const updatedCity = await City.findByIdAndUpdate(
		cityId,
		{
			$push: { destinations: destinationId },
		},
		{ new: true }
	).exec();

	await DestinationSite.findByIdAndUpdate(destinationId, { $set: { city: cityId } }).exec();

	return res.status(201).json(new ApiResponse(201, updatedCity, "City updated successfully"));
});

export { addCity, addDestination };
