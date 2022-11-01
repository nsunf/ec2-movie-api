interface WeeklyBoxOfficeResponse {
  boxOfficeResult: WeeklyBoxOfficeResult;
}

interface WeeklyBoxOfficeResult {
  boxofficeType: string;
  showRange: string;
  yearWeekTime: string;
  weeklyBoxOfficeList: BoxOffice[];
}