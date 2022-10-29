import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import indexRouter from "./routes/index";
import searchRouter from "./routes/search";


const app = express();

app.use(cors());

app.use("/", indexRouter);
app.use("/search", searchRouter);

app.listen(process.env.PORT, () => {
  console.log("Express server is running on port " + process.env.PORT);
})