import { City } from "../../models/city.model.js";
import { State } from "../../models/state.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addState = asyncHandler(async (req, res) => {
	const { name, cities } = req.body;

	if (!name) {
		throw new ApiError(400, "name is required");
	}

	if (!cities || !Array.isArray(cities) || cities.length === 0) {
		throw new ApiError(400, "Atleast one city is required to create state");
	}

	const existingState = await State.findOne({ name });

	if (existingState) {
		throw new ApiError(409, `State with name ${name} already exists`);
	}

	const state = new State({ name, cities });

	const savedState = await state.save();

	await City.updateMany({ _id: { $in: cities } }, { $set: { state: savedState._id } });

	return res.status(201).json(new ApiResponse(201, savedState, "State created successfully"));
});

const stateListing = asyncHandler(async (req, res) => {
	const { limit = 10, page = 1 } = req.query;

	const states = await State.aggregate([
		{ $project: { name: 1, totalCities: { $size: "$cities" }, createdAt: 1, updatedAt: 1 } },
		{ $skip: limit * (page - 1) },
		{ $limit: limit },
	]);

	if (!states.length) {
		throw new ApiError(500, "Unable to retrieve states data");
	}

	return res.status(200).json(new ApiResponse(200, states));
});

export { addState, stateListing };
