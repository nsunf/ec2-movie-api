interface BoxOfficeResponse {
  boxOfficeResult: BoxOfficeResult;
}

interface BoxOfficeResult {
  boxofficeType: string;
  showRange: string;
  dailyBoxOfficeList: BoxOffice[];
}
