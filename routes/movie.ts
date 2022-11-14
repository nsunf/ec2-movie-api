import express from "express";
import path from "path";

import Kobis from "../src/Kobis";
import Crawler from "../src/Crawler";

const router = express.Router();

const kobis = new Kobis();
const crawler = new Crawler();

router.get("/list", async (req, res) => {
  const movieNm = req.query.movieNm as string|undefined;
  const curPage = req.query.curPage as string|undefined ?? "1";
  if (!movieNm) {
    res.json({
      status: "fail"
    });
    return;
  }

  const movieListRes = await kobis.getMovieList(movieNm, curPage);
  const totCnt = movieListRes.movieListResult.totCnt;
  const movieList = movieListRes.movieListResult.movieList;
  const totPage = (Math.floor(totCnt / 10) + 1).toString();

  const editedMovieList = movieList.map(async movie => {
    const title = movie.movieNm;
    const dirs = movie.directors;
    console.log(dirs)

    let dirsStr = "";
    if (dirs.length > 1) {
      const dirsSArr = dirs.map(dir => dir.peopleNm);
      dirsStr = dirsSArr.join("|");
    } else if (dirs.length === 1) {
      dirsStr = dirs[0].peopleNm;
    }

    const movieInfo = await crawler.getMovieInfo(title, dirsStr);
    const poster = movieInfo?.posterSrc ?? "";
    const posterSmall = movieInfo?.posterSrcSmall ?? "";
    const score = movieInfo?.score ?? 0;

    return {
      ...movie,
      score,
      poster,
      posterSmall
    }
  })

  const result = await Promise.all(editedMovieList);

  res.json({
    status: "ok",
    curPage,
    totPage,
    totCnt,
    movieList: result
  })
});

router.get("/info", async (req, res) => {
  const movieCd = req.query.movieCd as string|undefined;
  if (!movieCd) {
    res.json({
      status: "fail",
      movieInfo: { }
    });
    return;
  }

  const movieInfoRes = await kobis.getMovieInfo(movieCd);
  const movieInfo = movieInfoRes.movieInfoResult.movieInfo;

  const title = movieInfo.movieNm;
  const dirs = movieInfo.directors;

  let dirsStr = "";
  if (dirs.length > 1) {
    const dirsSArr = dirs.map(dir => dir.peopleNm);
    dirsStr = dirsSArr.join("|");
  } else if (dirs.length === 1) {
    dirsStr = dirs[0].peopleNm;
  }

  const additionalInfo = await crawler.getMovieInfo(title, dirsStr);
  const result = {
    ...movieInfo,
    ...additionalInfo
  }

  res.json({
    status: "ok",
    movieInfo: result
  })
});

router.get("/list/dummy", (req, res) => [
  res.sendFile(path.resolve(__dirname, "../../public/dummyData/list.json"))
])

router.get("/info/dummy", (req, res) => [
  res.sendFile(path.resolve(__dirname, "../../public/dummyData/info.json"))
])

export default router;