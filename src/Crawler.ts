import axios from "axios";
import * as cheerio from "cheerio";

class Crawler {
  static url = {
    search: "https://movie.naver.com/movie/search/result.naver"
  }

  constructor() {
  }

  async getMovieUrl(title: string, dirs: string): Promise<string|undefined> {
    const searchParams = { section: "movie", query: title };
    const searchResponse = await axios.get(Crawler.url.search, { params: searchParams });

    const $ = cheerio.load(searchResponse.data);

    const list = $(".search_list_1").find("li");

    let link;

    list.each((_, item) => {
      const director = $(item).find("dl dd.etc").last().find("a:first-child").text();
      if (dirs.includes(director))
        link = $(item).find("dl dt a").attr("href");
    })

    if (!link)
      return;

    return "https://movie.naver.com" + link;
  }

  async getMovieInfo(title: string, dirs: string): Promise<{ posterSrc: string, summary1: string, summary2: string, score: string, images: string[] }|undefined> {
    const urlStr = await this.getMovieUrl(title, dirs);
    if (!urlStr) return;

    const response = await axios.get(urlStr);
    let $ = cheerio.load(response.data);

    const posterSrc = $(".poster a img").attr("src");
    const summary1 = $(".story_area .h_tx_story").text();
    const summary2 = $(".story_area .con_tx").text();
    const score = $(".mv_info_area .main_score .score:first-child a .star_score :not(:first-child)").text();

    const posterUrl = new URL(posterSrc ?? "");
    const imgSrc = posterUrl.origin + posterUrl.pathname;

    // still cut
    const url = new URL(urlStr);
    const code = url.searchParams.get("code");

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

    return {
      posterSrc: imgSrc,
      summary1,
      summary2,
      score,
      images: imgSrcList
    };
  }

  async getPosterImg(title: string, dirs: string): Promise<string|undefined> {
    const urlStr = await this.getMovieUrl(title, dirs);
    if (!urlStr) return;

    const response = await axios.get(urlStr);
    const $ = cheerio.load(response.data);

    const posterSrc = $(".poster a img").attr("src");
    const posterUrl = new URL(posterSrc ?? "");
    const imgSrc = posterUrl.origin + posterUrl.pathname;

    return imgSrc;
  }

  async getStillCutImages(title: string, dirs: string): Promise<string[]|undefined> {
    const urlStr = await this.getMovieUrl(title, dirs);
    if (!urlStr) return;
    const url = new URL(urlStr);

    const code = url.searchParams.get("code");

    const photoViewUrl = "https://movie.naver.com/movie/bi/mi/photo.naver?code=" + code + "#tab";

    const photoViewResponse = await axios.get(photoViewUrl);

    const $ = cheerio.load(photoViewResponse.data);

    const imgEls = $("#gallery_group").find("._brick a img");

    const imgSrcList: string[] = [];
    imgEls.each((_, el) => {
      const src = $(el).attr("src") as string;
      const imgUrl = new URL(src);
      imgSrcList.push(imgUrl.origin + imgUrl.pathname);
    })

    return imgSrcList;
  }
}

export default Crawler;