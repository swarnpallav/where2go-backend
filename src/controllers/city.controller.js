import { City } from "../models/city.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCitiesByStateId = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) {
		throw new ApiError(400, "id is required");
	}

	const cities = await City.find({ state: id }, { name: 1, _id: 1 });

	return res.status(200).json(new ApiResponse(200, cities));
});

const getCityById = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) {
		throw new ApiError(400, "id is required");
	}

	const city = await City.findById(id);

	if (!city) {
		throw new ApiError(404, "City not found");
	}

	return res.status(200).json(new ApiResponse(200, city));
});

export { getCitiesByStateId, getCityById };
