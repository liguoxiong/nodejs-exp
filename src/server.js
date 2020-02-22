import express, { Router } from "express";
import cors from "cors";
import path from "path";
import connectToDB from "./config/databaseConnecter";
import routes from "./routes";
import NewError from "./helpers/NewError";

import { globalErrorHandler } from "./middleware";
require("dotenv").config();

const app = express();

const router = Router();
const corsOptions = {
  origin: [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://quanly.homaitech.com"
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range", "x-auth-token"]
};
app.use(cors(corsOptions));
connectToDB();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/api/v1", routes);
app.use("/api/v2", (req, res) => res.send("it works!"));
// app.use("/", (req, res) =>
//   res.sendFile(path.join(__dirname + "/buildClient/index.html"))
// );
app.all("*", (req, res, next) => {
  next(new NewError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log("Press Ctrl+C to quit.");
});
