import express from "express";
import path from "path";
import axios from "axios";

const router = express.Router();

router.get("/", (req, res) => {
  // axios.get("https://movie-phinf.pstatic.net/20221027_186/1666838951651Y4Vt8_JPEG/movie_image.jpg?type=m203_290_2", { responseType: "arraybuffer"})
  //   .then(response => response.data)
  //   .then(data => Buffer.from(data, 'base64'))
  //   .then(base => {
  //     res.writeHead(200, { "Content-Type": "text/html;charset=utf-8;" });
  //     res.write(`<img src="data:image/jpg;base64,${base.toString("base64")}"/>`);
  //     res.end();
  //   })

  res.sendFile(path.resolve(__dirname, "../../views/index.html"));
})

export default router;