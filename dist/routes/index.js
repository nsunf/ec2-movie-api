"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write("<h1>Custom API</h1>");
    res.end();
});
exports.default = router;
