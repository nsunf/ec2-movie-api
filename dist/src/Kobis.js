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
const axios_1 = __importDefault(require("axios"));
class Kobis {
    constructor() {
    }
    getDailyBoxOffice(targetDt) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                key: Kobis.key,
                targetDt
            };
            const response = yield axios_1.default.get(Kobis.url.daily, { params });
            return response.data;
        });
    }
    getWeeklyBoxOffice(targetDt) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                key: Kobis.key,
                targetDt,
                weekGb: "0"
            };
            const response = yield axios_1.default.get(Kobis.url.weekly, { params });
            return response.data;
        });
    }
    getMovieList(movieNm, curPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                key: Kobis.key,
                movieNm,
                curPage
            };
            const response = yield axios_1.default.get(Kobis.url.list, { params });
            return response.data;
        });
    }
    getMovieInfo(movieCd) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                key: Kobis.key,
                movieCd
            };
            const response = yield axios_1.default.get(Kobis.url.info, { params });
            return response.data;
        });
    }
}
Kobis.key = "6e366ce8b5c64c17cdc1520bdc6af5d8";
Kobis.url = {
    daily: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
    weekly: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json",
    list: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json",
    info: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json"
};
exports.default = Kobis;
