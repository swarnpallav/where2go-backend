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

export { addState };
