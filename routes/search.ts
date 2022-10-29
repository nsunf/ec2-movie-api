import express from "express";

import axios from "axios";
import * as cheerio from "cheerio";

const router = express.Router();

router.get("/movie/info", async (req, res) => {
  const title = req.query.title as string|undefined;
  const dirs = req.query.dirs as string|undefined;

  if (title == undefined) {
    res.json({
      "result": "failure (no title)"
    });
    return;
  }
  if (dirs == undefined) {
    res.json({
      "result": "failure (no dirs)"
    });
    return;
  }

  // 네이버 영화에서 검색
  const searchUrl = "https://movie.naver.com/movie/search/result.naver";
  const searchQuerys = { params: { section: "movie", query: title } };

  const searchResponse = await axios.get(searchUrl, searchQuerys);

  let $ = cheerio.load(searchResponse.data);
  
  const list = $(".search_list_1").find("li");

  let link;
  // 영화 제목과 감독명이 일치하는 항목 찾기
  list.each((_, item) => {
    const director = $(item).find("dl dd.etc").last().find("a:first-child").text();
    if (dirs.includes(director)) {
      link = $(item).find("dl dt a").attr("href");
    }
  })
  // 일치하는 항목이 없을 때
  if (!link) {
    res.json({
      "result": "failure",
      "data": { }
    })
    return;
  }
  // 영화 상세 페이지
  const movieInfoUrl = "https://movie.naver.com" + link;
  const movieInfoResponse = await axios.get(movieInfoUrl);

  $ = cheerio.load(movieInfoResponse.data);

  const posterSrc = $(".poster a img").attr("src");
  const summary1 = $(".story_area .h_tx_story").text();
  const summary2 = $(".story_area .con_tx").text();
  const score = $(".mv_info_area .main_score .score:first-child a .star_score :not(:first-child)").text();

  const posterUrl = new URL(posterSrc ?? "");
  const imgSrc = posterUrl.origin + posterUrl.pathname;

  // 포토뷰 페이지
  const _url = new URL(movieInfoUrl);
  const code = _url.searchParams.get("code");

  const photoViewUrl = "https://movie.naver.com/movie/bi/mi/photo.naver?code=" + code + "#tab";

  const photoViewResponse = await axios.get(photoViewUrl);

  $ = cheerio.load(photoViewResponse.data);

  const imgEls = $("#gallery_group").find("._brick a img");

  const imgSrcList: string[] = [];
  imgEls.each((_, el) => {
    const src = $(el).attr("src") as string;
    const imgUrl = new URL(src);
    imgSrcList.push(imgUrl.origin + imgUrl.pathname);
  })

  
  res.json({
    "result": "success",
    "data": {
      "posterSrc": imgSrc,
      "summary1": summary1,
      "summary2": summary2,
      "score": score,
      "images": imgSrcList
    }
  })
})

router.get("/movie/poster", async(req, res) => {
  const title = req.query.title as string|undefined;
  const dirs = req.query.dirs as string|undefined;

  if (title == undefined) {
    res.json({
      "result": "failure (no title)"
    });
    return;
  }
  if (dirs == undefined) {
    res.json({
      "result": "failure (no dirs)"
    });
    return;
  }

  // 네이버 영화에서 검색
  const searchUrl = "https://movie.naver.com/movie/search/result.naver";
  const searchQuerys = { params: { section: "movie", query: title } };

  const searchResponse = await axios.get(searchUrl, searchQuerys);

  let $ = cheerio.load(searchResponse.data);
  
  const list = $(".search_list_1").find("li");

  let link;
  // 영화 제목과 감독명이 일치하는 항목 찾기
  list.each((_, item) => {
    const director = $(item).find("dl dd.etc").last().find("a:first-child").text();
    if (dirs.includes(director)) {
      link = $(item).find("dl dt a").attr("href");
    }
  })
  // 일치하는 항목이 없을 때
  if (!link) {
    res.json({
      "result": "failure"
    })
    return;
  }
  // 영화 상세 페이지
  const movieInfoUrl = "https://movie.naver.com" + link;
  const movieInfoResponse = await axios.get(movieInfoUrl);

  $ = cheerio.load(movieInfoResponse.data);

  const posterSrc = $(".poster a img").attr("src");

  const posterUrl = new URL(posterSrc ?? "");
  const imgSrc = posterUrl.origin + posterUrl.pathname;

  res.json({
    "result": "success",
    "data": {
      "posterSrc": imgSrc
    }
  })
})


export default router;
