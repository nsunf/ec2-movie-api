import express from "express";
import path from "path";

import Crawler from "../src/Crawler";
import Kobis from "../src/Kobis";

const router = express.Router();

const kobis = new Kobis();
const crawler = new Crawler();

router.get("/daily", async (req, res) => {
  const targetDt = req.query.targetDt as string|undefined;
  if (!targetDt) {
    res.json({
      status: "fail",
      showRange: "",
      dailyBoxOfficeList: []
    });
    return;
  }

  const boxOfficeRes = await kobis.getDailyBoxOffice(targetDt);
  const showRange = boxOfficeRes.boxOfficeResult.showRange;
  const movieList = boxOfficeRes.boxOfficeResult.dailyBoxOfficeList;

  const editedMovieList = movieList.map(async movie => {
    const movieInfo = await kobis.getMovieInfo(movie.movieCd);
    const title = movie.movieNm;
    const dirs = movieInfo.movieInfoResult.movieInfo.directors;

    let dirsStr = "";
    if (dirs.length > 1) {
      const dirsSArr = dirs.map(dir => dir.peopleNm);
      dirsStr = dirsSArr.join("|");
    } else if (dirs.length === 1) {
      dirsStr = dirs[0].peopleNm;
    }

    const imgSrc = await crawler.getPosterImg(title, dirsStr);

    return {
      ...movie,
      poster: imgSrc
    }
  })

  const result = await Promise.all(editedMovieList);

  res.json({
    status: "ok",
    showRange,
    dailyBoxOfficeList: result
  })
});

router.get("/weekly", async (req, res) => {
  const targetDt = req.query.targetDt as string|undefined;
  if (!targetDt) {
    res.json({
      status: "fail",
      showRange: "",
      weeklyBoxOfficeList: []
    });
    return;
  }

  const boxOfficeRes = await kobis.getWeeklyBoxOffice(targetDt);
  const showRange = boxOfficeRes.boxOfficeResult.showRange;
  const yearWeekTime = boxOfficeRes.boxOfficeResult.yearWeekTime;
  const movieList = boxOfficeRes.boxOfficeResult.weeklyBoxOfficeList;

  const editedMovieList = movieList.map(async movie => {
    const movieInfo = await kobis.getMovieInfo(movie.movieCd);
    const title = movie.movieNm;
    const dirs = movieInfo.movieInfoResult.movieInfo.directors;

    let dirsStr = "";
    if (dirs.length > 1) {
      const dirsSArr = dirs.map(dir => dir.peopleNm);
      dirsStr = dirsSArr.join("|");
    } else if (dirs.length === 1) {
      dirsStr = dirs[0].peopleNm;
    }

    const imgSrc = await crawler.getPosterImg(title, dirsStr);

    return {
      ...movie,
      poster: imgSrc
    }
  })

  const result = await Promise.all(editedMovieList);

  res.json({
    status: "ok",
    showRange,
    yearWeekTime,
    weeklyBoxOfficeList: result
  })
});

router.get("/daily/dummy", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../public/dummyData/daily.json"));
})

router.get("/weekly/dummy", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../public/dummyData/weekly.json"));
})

export default router;