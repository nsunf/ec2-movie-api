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
const Kobis_1 = __importDefault(require("../src/Kobis"));
const Crawler_1 = __importDefault(require("../src/Crawler"));
const router = express_1.default.Router();
const kobis = new Kobis_1.default();
const crawler = new Crawler_1.default();
router.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const movieNm = req.query.movieNm;
    const curPage = (_a = req.query.curPage) !== null && _a !== void 0 ? _a : "1";
    if (!movieNm) {
        res.json({
            status: "fail"
        });
        return;
    }
    const movieListRes = yield kobis.getMovieList(movieNm, curPage);
    const totCnt = movieListRes.movieListResult.totCnt;
    const movieList = movieListRes.movieListResult.movieList;
    const totPage = Math.floor(totCnt / 10) + 1;
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
        curPage,
        totPage,
        totCnt,
        movieList: result
    });
}));
router.get("/info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movieCd = req.query.movieCd;
    if (!movieCd) {
        res.json({
            status: "fail",
            movieInfo: {}
        });
        return;
    }
    const movieInfoRes = yield kobis.getMovieInfo(movieCd);
    const movieInfo = movieInfoRes.movieInfoResult.movieInfo;
    const title = movieInfo.movieNm;
    const dirs = movieInfo.directors;
    let dirsStr = "";
    if (dirs.length > 1) {
        const dirsSArr = dirs.map(dir => dir.peopleNm);
        dirsStr = dirsSArr.join("|");
    }
    else if (dirs.length === 1) {
        dirsStr = dirs[0].peopleNm;
    }
    const additionalInfo = yield crawler.getMovieInfo(title, dirsStr);
    const result = Object.assign(Object.assign({}, movieInfo), additionalInfo);
    res.json({
        status: "ok",
        movieInfo: result
    });
}));
exports.default = router;
