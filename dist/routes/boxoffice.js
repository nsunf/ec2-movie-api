"use strict";
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
const path_1 = __importDefault(require("path"));
const Crawler_1 = __importDefault(require("../src/Crawler"));
const Kobis_1 = __importDefault(require("../src/Kobis"));
const router = express_1.default.Router();
const kobis = new Kobis_1.default();
const crawler = new Crawler_1.default();
router.get("/daily", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const targetDt = req.query.targetDt;
    if (!targetDt) {
        res.json({
            status: "fail",
            showRange: "",
            dailyBoxOfficeList: []
        });
        return;
    }
    const boxOfficeRes = yield kobis.getDailyBoxOffice(targetDt);
    const showRange = boxOfficeRes.boxOfficeResult.showRange;
    const movieList = boxOfficeRes.boxOfficeResult.dailyBoxOfficeList;
    const editedMovieList = movieList.map((movie) => __awaiter(void 0, void 0, void 0, function* () {
        const movieInfo = yield kobis.getMovieInfo(movie.movieCd);
        const title = movie.movieNm;
        const dirs = movieInfo.movieInfoResult.movieInfo.directors;
        let dirsStr = "";
        if (dirs.length > 1) {
            const dirsSArr = dirs.map(dir => dir.peopleNm);
            dirsStr = dirsSArr.join("|");
        }
        else if (dirs.length === 1) {
            dirsStr = dirs[0].peopleNm;
        }
        const imgSrc = yield crawler.getPosterImg(title, dirsStr);
        return Object.assign(Object.assign({}, movie), { poster: imgSrc });
    }));
    const result = yield Promise.all(editedMovieList);
    res.json({
        status: "ok",
        showRange,
        dailyBoxOfficeList: result
    });
}));
router.get("/weekly", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const targetDt = req.query.targetDt;
    if (!targetDt) {
        res.json({
            status: "fail",
            showRange: "",
            weeklyBoxOfficeList: []
        });
        return;
    }
    const boxOfficeRes = yield kobis.getWeeklyBoxOffice(targetDt);
    const showRange = boxOfficeRes.boxOfficeResult.showRange;
    const yearWeekTime = boxOfficeRes.boxOfficeResult.yearWeekTime;
    const movieList = boxOfficeRes.boxOfficeResult.weeklyBoxOfficeList;
    const editedMovieList = movieList.map((movie) => __awaiter(void 0, void 0, void 0, function* () {
        const movieInfo = yield kobis.getMovieInfo(movie.movieCd);
        const title = movie.movieNm;
        const dirs = movieInfo.movieInfoResult.movieInfo.directors;
        let dirsStr = "";
        if (dirs.length > 1) {
            const dirsSArr = dirs.map(dir => dir.peopleNm);
            dirsStr = dirsSArr.join("|");
        }
        else if (dirs.length === 1) {
            dirsStr = dirs[0].peopleNm;
        }
        const imgSrc = yield crawler.getPosterImg(title, dirsStr);
        return Object.assign(Object.assign({}, movie), { poster: imgSrc });
    }));
    const result = yield Promise.all(editedMovieList);
    res.json({
        status: "ok",
        showRange,
        yearWeekTime,
        weeklyBoxOfficeList: result
    });
}));
router.get("/daily/dummy", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../../public/dummyData/daily.json"));
});
router.get("/weekly/dummy", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../../public/dummyData/weekly.json"));
});
exports.default = router;
