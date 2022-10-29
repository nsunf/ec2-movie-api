import express from "express";

// import puppeteer from "puppeteer";
import axios from "axios";
import * as cheerio from "cheerio";


const router = express.Router();

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

router.get("/movie/info", async (req, res) => {
  const title = req.query.title as string;

  const searchUrl = "https://movie.naver.com/movie/search/result.naver";
  const searchQuerys = { params: { section: "movie", query: title } };

  const searchResponse = await axios.get(searchUrl, searchQuerys);

  let $ = cheerio.load(searchResponse.data);
  
  const list = $(".search_list_1").find("li");

  let link = $(list[0]).find("dl dt a").attr("href");
  
  const movieInfoUrl = "https://movie.naver.com" + link;
  console.log(movieInfoUrl)
  const movieInfoResponse = await axios.get(movieInfoUrl);

  $ = cheerio.load(movieInfoResponse.data);

  const posterSrc = $(".poster a img").attr("src");
  const summary1 = $(".story_area .h_tx_story").text();
  const summary2 = $(".story_area .con_tx").text();

  const posterUrl = new URL(posterSrc ?? "");
  const imgSrc = posterUrl.origin + posterUrl.pathname;
  
  res.json({
    "postSrc": imgSrc,
    "summary1": summary1,
    "summary2": summary2
  })
})

router.get("/movie/poster", (req, res) => {

})


export default router;
