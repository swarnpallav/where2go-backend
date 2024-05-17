import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";

const generateAccessAndRefereshTokens = async user => {
	try {
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(500, "Something went wrong while generating referesh and access token");
	}
};

const signUp = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if ([email, password].some(field => field?.trim() === "")) {
		throw new ApiError(400, "All fields are required");
	}

	const existingUser = await User.findOne({ email });

	const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

	if (existingUser) {
		if (existingUser.isVerified) {
			throw new ApiError(409, "User with email already exists");
		}

		existingUser.password = password;
		existingUser.verificationCode = verificationCode;
		existingUser.verificationExpiry = new Date(Date.now() + 3600000);
		existingUser.save();
	} else {
		const avatarLocalPath = req.file?.path;

		let avatar = { url: "" };
		if (avatarLocalPath) {
			avatar = await uploadOnCloudinary(avatarLocalPath);
		}

		const user = new User({
			avatar: avatar.url,
			email,
			password,
			verificationExpiry: new Date(Date.now() + 3600000),
			verificationCode,
		});

		const createdUser = await user.save();

		if (!createdUser) {
			throw new ApiError(500, "Something went wrong while registering the user");
		}
	}

	await sendMail({
		to: email,
		subject: "Verify your email",
		html: `<p>Your verification code is ${verificationCode}</p>`,
	});

	return res.status(201).json(
		new ApiResponse(
			201,
			{
				email,
			},
			"Please verify your email."
		)
	);
});

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email) {
		throw new ApiError(400, "email is required");
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(404, "User does not exist");
	}

	if (!user.isVerified) {
		throw new ApiError(401, "User verification pending.");
	}

	const isPasswordValid = await user.isPasswordCorrect(password);

	if (!isPasswordValid) {
		throw new ApiError(401, "Invalid user credentials");
	}

	const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					user: { _id: user._id, email: user.email, avatar: user.avatar },
					accessToken,
					refreshToken,
				},
				"User logged In Successfully"
			)
		);
});

const verifyEmail = asyncHandler(async (req, res) => {
	const { email, otp } = req.body;

	if (!email || !otp) {
		throw new ApiError(400, "email and otp required!");
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(404, "user not found");
	}

	if (user.isVerified) {
		throw new ApiError(400, "User already verified");
	}

	if (user.verificationCode !== otp) {
		throw new ApiError(409, "Invalid OTP!");
	}

	if (new Date(user.verificationExpiry) < new Date()) {
		throw new ApiError(400, "Verification code has been expired. Please sign up again.");
	}

	user.isVerified = true;

	await user.save();

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ email: user.email, avatar: user.avatar },
				"User verified successfully!"
			)
		);
});

const refreshAccessToken = asyncHandler(async (req, res) => {
	const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

	if (!incomingRefreshToken) {
		throw new ApiError(401, "unauthorized request");
	}

	try {
		const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

		const user = await User.findById(decodedToken?._id);

		if (!user) {
			throw new ApiError(401, "Invalid refresh token");
		}

		if (incomingRefreshToken !== user?.refreshToken) {
			throw new ApiError(401, "Refresh token is expired or used");
		}

		const options = {
			httpOnly: true,
			secure: true,
		};

		const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user);

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", newRefreshToken, options)
			.json(
				new ApiResponse(
					200,
					{ accessToken, refreshToken: newRefreshToken },
					"Access token refreshed"
				)
			);
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid refresh token");
	}
});

const logout = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$unset: {
				refreshToken: 1, // this removes the field from document
			},
		},
		{
			new: true,
		}
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200, {}, "User logged Out"));
});

const userInfo = asyncHandler(async (req, res) => {
	return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export { signUp, login, refreshAccessToken, logout, userInfo, verifyEmail };
