import { State } from "../models/state.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllStates = asyncHandler(async (req, res) => {
	const states = await State.find().select({ name: 1, _id: 1 });

	return res.status(200).json(new ApiResponse(200, states));
});

export { getAllStates };
