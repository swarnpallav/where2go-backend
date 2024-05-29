import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, _, next) => {
	try {
		const user = req.user;

		if (!user.isAdmin) {
			throw new ApiError(401, "Unauthorized request");
		}

		next();
	} catch (error) {
		throw new ApiError(401, error?.message || "Unauthorized request");
	}
});
