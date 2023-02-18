export function chunkArrayInGroups<T>(arr, size): T[][] {
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
