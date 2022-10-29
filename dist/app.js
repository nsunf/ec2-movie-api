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
const search_1 = __importDefault(require("./routes/search"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/", index_1.default);
app.use("/search", search_1.default);
app.listen(process.env.PORT, () => {
    console.log("Express server is running on port " + process.env.PORT);
});
