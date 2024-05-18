import { Resend } from "resend";
import { ApiError } from "./ApiError.js";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail({ to, subject, html }) {
	if (!to || !html) {
		throw new ApiError(400, "email receiver & body is required");
	}
	const { data, error } = await resend.emails.send({
		from: process.env.MAIL_DOMAIN,
		to,
		subject,
		html,
	});

	if (error) {
		throw new ApiError(error.statusCode, error.message);
	}
}

export default sendMail;
