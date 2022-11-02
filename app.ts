import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import indexRouter from "./routes/index";
import boxofficeRouter from "./routes/boxoffice";
import movieRouter from "./routes/movie";


const app = express();

app.use(cors());
app.use(express.static("public"));

app.use("/", indexRouter);
app.use("/boxoffice", boxofficeRouter);
app.use("/movie", movieRouter);

app.listen(process.env.PORT, () => {
  console.log("Express server is running on port " + process.env.PORT);
})