import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./contants.js";

const app = express();

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());

//public routes import
import userRouter from "./routes/user.routes.js";
import stateRouter from "./routes/state.routes.js";
import destinationRouter from "./routes/destinationSite.routes.js";
import cityRouter from "./routes/city.routes.js";
import reviewRouter from "./routes/review.routes.js";
import messageRouter from "./routes/message.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";

//admin routes import
import userAdminRouter from "./routes/admin/user.admin.routes.js";
import stateAdminRouter from "./routes/admin/state.admin.routes.js";
import cityAdminRouter from "./routes/admin/city.admin.routes.js";
import reviewAdminRouter from "./routes/admin/review.admin.routes.js";
import destinationAdminRouter from "./routes/admin/destinationSite.admin.routes.js";

//public routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/state", stateRouter);
app.use("/api/v1/destination", destinationRouter);
app.use("/api/v1/city", cityRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/feedback", feedbackRouter);

//admin routes declaration
app.use("/api/v1/admin/user", userAdminRouter);
app.use("/api/v1/admin/state", stateAdminRouter);
app.use("/api/v1/admin/city", cityAdminRouter);
app.use("/api/v1/admin/review", reviewAdminRouter);
app.use("/api/v1/admin/destination", destinationAdminRouter);

export { app };
