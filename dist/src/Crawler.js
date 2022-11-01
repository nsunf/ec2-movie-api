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
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class Crawler {
    constructor() {
    }
    getMovieUrl(title, dirs) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = { section: "movie", query: title };
            const searchResponse = yield axios_1.default.get(Crawler.url.search, { params: searchParams });
            const $ = cheerio.load(searchResponse.data);
            const list = $(".search_list_1").find("li");
            let link;
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const director = $(item).find("dl dd.etc").last().find("a:first-child").text();
                if (dirs.includes(director)) {
                    link = $(item).find("dl dt a").attr("href");
                    break;
                }
            }
            if (!link)
                return;
            return "https://movie.naver.com" + link;
        });
    }
    getMovieInfo(title, dirs) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlStr = yield this.getMovieUrl(title, dirs);
            if (!urlStr)
                return;
            const response = yield axios_1.default.get(urlStr);
            let $ = cheerio.load(response.data);
            const posterSrc = $(".poster a img").attr("src");
            const summary1 = $(".story_area .h_tx_story").text();
            const summary2 = $(".story_area .con_tx").text();
            const score = $(".mv_info_area .main_score .score:first-child a .star_score :not(:first-child)").text();
            const posterUrl = new URL(posterSrc !== null && posterSrc !== void 0 ? posterSrc : "");
            const imgSrc = posterUrl.origin + posterUrl.pathname;
            // still cut
            const url = new URL(urlStr);
            const code = url.searchParams.get("code");
            const photoViewUrl = "https://movie.naver.com/movie/bi/mi/photo.naver?code=" + code + "#tab";
            const photoViewResponse = yield axios_1.default.get(photoViewUrl);
            $ = cheerio.load(photoViewResponse.data);
            const imgEls = $("#gallery_group").find("._brick a img");
            const imgSrcList = [];
            imgEls.each((_, el) => {
                const src = $(el).attr("src");
                const imgUrl = new URL(src);
                imgSrcList.push(imgUrl.origin + imgUrl.pathname);
            });
            return {
                posterSrc: imgSrc,
                summary1,
                summary2,
                score,
                images: imgSrcList
            };
        });
    }
    getPosterImg(title, dirs) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlStr = yield this.getMovieUrl(title, dirs);
            if (!urlStr)
                return;
            const response = yield axios_1.default.get(urlStr);
            const $ = cheerio.load(response.data);
            const posterSrc = $(".poster a img").attr("src");
            const posterUrl = new URL(posterSrc !== null && posterSrc !== void 0 ? posterSrc : "");
            const imgSrc = posterUrl.origin + posterUrl.pathname;
            return imgSrc;
        });
    }
    getStillCutImages(title, dirs) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlStr = yield this.getMovieUrl(title, dirs);
            if (!urlStr)
                return;
            const url = new URL(urlStr);
            const code = url.searchParams.get("code");
            const photoViewUrl = "https://movie.naver.com/movie/bi/mi/photo.naver?code=" + code + "#tab";
            const photoViewResponse = yield axios_1.default.get(photoViewUrl);
            const $ = cheerio.load(photoViewResponse.data);
            const imgEls = $("#gallery_group").find("._brick a img");
            const imgSrcList = [];
            imgEls.each((_, el) => {
                const src = $(el).attr("src");
                const imgUrl = new URL(src);
                imgSrcList.push(imgUrl.origin + imgUrl.pathname);
            });
            return imgSrcList;
        });
    }
}
Crawler.url = {
    search: "https://movie.naver.com/movie/search/result.naver"
};
exports.default = Crawler;
