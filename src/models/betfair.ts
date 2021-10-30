export function chunkArrayInGroups<T>(arr, size): Array<T[]> {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

export interface LoginResponse {
  token: string;
  product: string;
  status: string;
  error: string;
}

export interface BetFairResponse<T> {
  jsonrpc: string;
  result: T;
  error: any;
}

export type bf<T> = BetFairResponse<T[]>[];
export type bfSingle<T> = BetFairResponse<T>;

export interface EventType {
  id: string;
  name: string;
}

export interface EventTypeResponse {
  eventType: EventType;
  marketCount: number;
}

export interface Home {
  name: string;
  score: string;
  halfTimeScore: string;
  fullTimeScore: string;
  penaltiesScore: string;
  penaltiesSequence: any[];
  games: string;
  sets: string;
  numberOfYellowCards: number;
  numberOfRedCards: number;
  numberOfCards: number;
  numberOfCorners: number;
  numberOfCornersFirstHalf: number;
  bookingPoints: number;
}

export interface Away {
  name: string;
  score: string;
  halfTimeScore: string;
  fullTimeScore: string;
  penaltiesScore: string;
  penaltiesSequence: any[];
  games: string;
  sets: string;
  numberOfYellowCards: number;
  numberOfRedCards: number;
  numberOfCards: number;
  numberOfCorners: number;
  numberOfCornersFirstHalf: number;
  bookingPoints: number;
}

export interface Score {
  home: Home;
  away: Away;
  numberOfYellowCards: number;
  numberOfRedCards: number;
  numberOfCards: number;
  numberOfCorners: number;
  numberOfCornersFirstHalf: number;
  bookingPoints: number;
}

export interface UpdateDetail {
  updateTime: Date;
  updateId: number;
  matchTime: number;
  elapsedRegularTime: number;
  type: string;
  updateType: string;
}

export interface IBetFairLiveResult {
  eventId: number;
  eventTypeId: number;
  score: Score;
  timeElapsed: number;
  elapsedRegularTime: number;
  updateDetails: UpdateDetail[];
  status: string;
  inPlayMatchStatus: string;
}

export interface IStatsBetfair {
  Entity: string;
  Id: string;
  HomeGoals: number;
  HomePenalties: number;
  HomeYellowCards: number;
  HomeRedCards: number;
  HomeTotalCards: number;
  HomeSubstitutions: number;
  HomeShotsOnTarget: number;
  HomeShotsOffTarget: number;
  HomeBlockedShots: number;
  HomeShotsOffWoodwork: number;
  HomeTotalShots: number;
  HomeCorners: number;
  HomeFouls: number;
  HomeOffsides: number;
  HomeGoalKicks: number;
  HomeFreeKicks: number;
  HomeDangerousFreeKicks: number;
  HomeThrowIns: number;
  HomeAttacks: number;
  HomeDangerousAttacks: number;
  AwayGoals: number;
  AwayPenalties: number;
  AwayYellowCards: number;
  AwayRedCards: number;
  AwayTotalCards: number;
  AwaySubstitutions: number;
  AwayShotsOnTarget: number;
  AwayShotsOffTarget: number;
  AwayBlockedShots: number;
  AwayShotsOffWoodwork: number;
  AwayTotalShots: number;
  AwayCorners: number;
  AwayFouls: number;
  AwayOffsides: number;
  AwayGoalKicks: number;
  AwayFreeKicks: number;
  AwayDangerousFreeKicks: number;
  AwayThrowIns: number;
  AwayAttacks: number;
  AwayDangerousAttacks: number;
}
