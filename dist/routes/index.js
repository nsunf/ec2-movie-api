"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    // axios.get("https://movie-phinf.pstatic.net/20221027_186/1666838951651Y4Vt8_JPEG/movie_image.jpg?type=m203_290_2", { responseType: "arraybuffer"})
    //   .then(response => response.data)
    //   .then(data => Buffer.from(data, 'base64'))
    //   .then(base => {
    //     res.writeHead(200, { "Content-Type": "text/html;charset=utf-8;" });
    //     res.write(`<img src="data:image/jpg;base64,${base.toString("base64")}"/>`);
    //     res.end();
    //   })
    res.sendFile(path_1.default.resolve(__dirname, "../../views/index.html"));
});
exports.default = router;
