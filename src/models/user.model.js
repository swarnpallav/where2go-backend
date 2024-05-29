import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: [true, "username is required"],
			match: [/^[A-Za-z][A-Za-z0-9_]{3,15}$/],
			index: true,
		},
		email: {
			type: String,
			unique: true,
			required: [true, "email is required"],
			match: [
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please use a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "password is required"],
		},
		avatar: {
			type: String,
		},
		verificationCode: {
			type: Number,
			min: 100000,
			max: 999999,
		},
		verificationExpiry: {
			type: Date,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		refreshToken: {
			type: String,
		},
		isAdmin: {
			type: Boolean,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};

userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

export const User = mongoose.model("User", userSchema);

/*

User 1
	- User 2
	- User 3

User 2

*/
