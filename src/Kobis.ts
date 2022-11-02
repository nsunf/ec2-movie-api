import axios from "axios";

class Kobis {
  // static key = "6e366ce8b5c64c17cdc1520bdc6af5d8";
  static key = "5e4750aaf469fb766d10b839c8026157";

  static url = {
    daily: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
    weekly: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json",
    list: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json",
    info: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json"
  }

  constructor() {

  }

  async getDailyBoxOffice(targetDt: string): Promise<BoxOfficeResponse> {
    const params = {
      key: Kobis.key,
      targetDt
    }
    const response = await axios.get(Kobis.url.daily, { params });

    return response.data;
  }

  async getWeeklyBoxOffice(targetDt: string): Promise<WeeklyBoxOfficeResponse> {
    const params = {
      key: Kobis.key,
      targetDt,
      weekGb: "0"
    }
    const response = await axios.get(Kobis.url.weekly, { params });

    return response.data;
  }

  async getMovieList(movieNm: string, curPage: string): Promise<MovieListResponse> {
    const params = {
      key: Kobis.key,
      movieNm,
      curPage
    }
    const response = await axios.get(Kobis.url.list, { params });

    return response.data;
  }

  async getMovieInfo(movieCd: string): Promise<MovieInfoResponse> {
    const params = {
      key: Kobis.key,
      movieCd
    }
    const response = await axios.get(Kobis.url.info, { params });

    return response.data;
  }
}

export default Kobis;