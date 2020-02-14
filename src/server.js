import express, { Router } from "express";
import cors from "cors";
import path from "path";
import connectToDB from "./config/databaseConnecter";
import routes from "./routes";
require("dotenv").config();

const app = express();

const router = Router();
app.use(cors());
connectToDB();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/api/v1", routes);
app.use("/api/v2", (req, res) => res.send("it works!"));
// app.use("/", (req, res) =>
//   res.sendFile(path.join(__dirname + "/buildClient/index.html"))
// );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log("Press Ctrl+C to quit.");
});
