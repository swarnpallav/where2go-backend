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

//routes import
import userRouter from "./routes/user.routes.js";
import stateRouter from "./routes/state.routes.js";
import destinationRouter from "./routes/destinationSite.routes.js";
import cityRouter from "./routes/city.routes.js";

//routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/state", stateRouter);
app.use("/api/v1/destination", destinationRouter);
app.use("/api/v1/city", cityRouter);

export { app };
