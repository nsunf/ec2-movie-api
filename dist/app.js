"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const boxoffice_1 = __importDefault(require("./routes/boxoffice"));
const movie_1 = __importDefault(require("./routes/movie"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static("public"));
app.use("/", index_1.default);
app.use("/boxoffice", boxoffice_1.default);
app.use("/movie", movie_1.default);
app.listen(process.env.PORT, () => {
    console.log("Express server is running on port " + process.env.PORT);
});
