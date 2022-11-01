interface MovieListResponse {
  movieListResult: MovieListResult;
}

interface MovieListResult {
  totCnt: number;
  source: string;
  movieList: Movie[];
}

interface Movie {
  movieCd: string;
  movieNm: string;
  movieNmEn: string;
  prdtYear: string;
  openDt: string;
  typeNm: string;
  prdtStatNm: string;
  nationAlt: string;
  genreAlt: string;
  repNationNm: string;
  repGenreNm: string;
  directors: { peopleNm: string }[];
  companys: { companyCd: string, companyNm: string }[];
}