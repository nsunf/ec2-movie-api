import express from "express";
import indexRouter from "./routes/index";
import searchRouter from "./routes/search";


const app = express();

app.use("/", indexRouter);
app.use("/search", searchRouter);

app.listen(8000, () => {
  console.log("Express server is running on port 8000");
})