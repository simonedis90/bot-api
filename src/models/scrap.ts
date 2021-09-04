//#region betfair scraping

import { ICalc } from "./response.dto";

export interface Score {
  home: number;
  away: number;
}

export interface Team {
  home: string;
  away: string;
  score: Score;
}


export interface ScrapObjectResponse {
  home: Team[];
  away: Team[];
  scrapEntityHome: ScrapMatchEntity[];
  scrapEntityAway: ScrapMatchEntity[];
}
//#endregion
//#region diretta scraping

interface IStats {
  odds: {
    away: {
      1: number,
      x: number,
      2: number
    },
    goalScored: {
      spread: {
        1_5: {
          under: number,
          over: number
        },
        2_5: {
          under: number,
          over: number
        }
      }
    },
    btts: {
      yes: number,
      no: number
    }
  },
  ballPossession: number;
  shoots: number;
  shootsOnTarget: number;
  shootsOut: number;
  shootsLocked: number;
  freekick: number;
  corners: number;
  offsides: number;
  lineOut: number;
  faults: number;
  yellowCards: number;
  attack: number;
  dangerousAttack: number;
  ht: {
    gol: number
  },
  ft: {
    gol: number
  }
}
export interface IMatch {
  end?: boolean;
  time?: number;
  matchDate: any;
  sourceId: string;
  league: string;
  home: string;
  away: string;
  round?: number;
  stats: {
    home: Partial<IStats>,
    away: Partial<IStats>,
    btts,
    totals
  },
  goals: any[],

  linkedMatches?: {
    home: IMatch[],
    away: IMatch[]
  }
};

export class ScrapMatchEntity implements IMatch{
  id: number;

  sourceId: string;

  matchDate: Date;
  
  home: string;

  away: string;

  league: string;

  stats: {
    home: IStats,
    away: IStats,
    
      totals: {
        u: number,
        o: number
      },
      btts: {
        y: number,
        n: number
      }
    
  };

  goals: Array<{minute: number, player: string, team: string}>

  round: number;

  calc?: ICalc;
}



  //#endregion