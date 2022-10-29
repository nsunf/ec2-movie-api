"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const search_1 = __importDefault(require("./routes/search"));
const app = (0, express_1.default)();
app.use("/", index_1.default);
app.use("/search", search_1.default);
app.listen(3000, () => {
    console.log("Express server is running on port 3000");
});
