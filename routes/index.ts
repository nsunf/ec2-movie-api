import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8"});
  res.write("<h1>Custom API</h1>");
  res.end();
})

export default router;