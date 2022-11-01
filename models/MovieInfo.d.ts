interface MovieInfoResponse {
  movieInfoResult: MovieInfoResult;
}

interface MovieInfoResult {
  movieInfo: MovieInfo;
  source: string;
}

interface MovieInfo {
  movieCd: string;
  movieNm: string;
  movieNmEn: string;
  movieNmOg: string;
  showTm: string;
  prdtYear: string;
  openDt: string;
  prdtStatNm: string;
  typeNm: string;
  nations: { nationNm: string }[];
  genres: { genreNm: string }[];
  directors: { peopleNm: string, peopleNmEn: string }[];
  actors: { peopleNm: string, peopleNmEn: string, cast: string, castEn: string }[];
  showTypes: { showTypeGroupNm: string, showTypeNm: string }[];
  companys: { companyCd: string, companyNm: string, companyNmEn: string, companyPartNm: string }[];
  audits: { auditNo: string, watchGradeNm: string }[];
  staffs: { peopleNm: string, peopleNmEn: string, staffRoleNm: string }[];
}