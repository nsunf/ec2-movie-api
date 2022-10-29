"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import puppeteer from "puppeteer";
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const router = express_1.default.Router();
/*
router.get("/movie/info", async (req, res) => {
  let title = req.query.title as string;
  let openDt = req.query.openDt as string;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  let searchUrl = `https://movie.naver.com/movie/search/result.naver?section=movie&query=${title}`;
  await page.goto(searchUrl);

  await page.waitForSelector(".search_list_1");

  let searchResults = await page.$$eval(".search_list_1 li", elements => {
    let items = elements.map(el => {
      let href = el.querySelector("dl dt a")?.getAttribute("href") ?? null;
      let year = el.querySelector("dl .etc > a:last-child")?.textContent ?? null;
      return { href, year };
    })
    return items
  })

  let link = searchResults[0].href;

  for (let i = 0; i < searchResults.length; i++) {
    let item = searchResults[i];
    if (item.year && item.year == new Date(openDt).getFullYear().toString()) {
      link = item.href;
    }
  }

  if (link) {
    await page.goto("https://movie.naver.com/" + link);

    await page.waitForSelector(".poster a img");
    await page.waitForSelector(".h_tx_story");
    await page.waitForSelector(".con_tx");

    let posterSrc = await page.$eval(".poster a img", el => el.getAttribute("src"));
    let summary = await page.$eval(".h_tx_story", el => el.textContent);
    let content = await page.$eval(".con_tx", el => el.textContent);

    // res.json({ src: posterSrc, summary, content });
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write(`<img src="${posterSrc}" style="width: 300px;" />`);
    res.end();
  } else {

  }


  // let selector = ".h_tx_story";

  // await page.waitForSelector(selector);

  // let data = await page.$eval(selector, element => {
  //   return element.textContent;
  // });

  // console.log(data);

  browser.close();
})
*/
router.get("/movie/info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.query.title;
    const searchUrl = "https://movie.naver.com/movie/search/result.naver";
    const searchQuerys = { params: { section: "movie", query: title } };
    const searchResponse = yield axios_1.default.get(searchUrl, searchQuerys);
    let $ = cheerio.load(searchResponse.data);
    const list = $(".search_list_1").find("li");
    let link = $(list[0]).find("dl dt a").attr("href");
    const movieInfoUrl = "https://movie.naver.com" + link;
    console.log(movieInfoUrl);
    const movieInfoResponse = yield axios_1.default.get(movieInfoUrl);
    $ = cheerio.load(movieInfoResponse.data);
    const posterSrc = $(".poster a img").attr("src");
    const summary1 = $(".story_area .h_tx_story").text();
    const summary2 = $(".story_area .con_tx").text();
    const posterUrl = new URL(posterSrc !== null && posterSrc !== void 0 ? posterSrc : "");
    const imgSrc = posterUrl.origin + posterUrl.pathname;
    res.json({
        "postSrc": imgSrc,
        "summary1": summary1,
        "summary2": summary2
    });
}));
router.get("/movie/poster", (req, res) => {
});
exports.default = router;
