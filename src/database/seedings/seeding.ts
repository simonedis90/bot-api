import { HttpService, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LeagueConfigEntity } from '../entities/league-config.entity';
import { LeagueEntity } from '../entities/league.entity';
import { MatchEntity } from '../entities/match.entity';
import { ScrapMatchEntity } from '../entities/scrap-match-entity';
import { StatsEntity } from '../entities/stats.entity';
import { TeamEntity } from '../entities/team.entity';
import {
  CONFIG_LEAGUE,
  LEAGUE_REPOSITORY,
  MATCH_REPOSITORY,
  SRAP_MATCH_REPOSITORY,
  STATS_REPOSITORY,
  TEAM_REPOSITORY,
} from '../repositories/scraper';
import { env } from '../../../../scraper-database/dist/main';

export class SeedingData {
  constructor(
    @Inject(CONFIG_LEAGUE)
    private configRepository: Repository<LeagueConfigEntity>,
    @Inject(TEAM_REPOSITORY)
    private teamRepository: Repository<TeamEntity>,
    @Inject(LEAGUE_REPOSITORY)
    private leagueRepository: Repository<LeagueEntity>,
    @Inject(MATCH_REPOSITORY)
    private matchRepository: Repository<MatchEntity>,
    @Inject(STATS_REPOSITORY)
    private statsRepository: Repository<StatsEntity>,
    @Inject(SRAP_MATCH_REPOSITORY)
    private scrapMatches: Repository<ScrapMatchEntity>,
    private httpClient: HttpService,
  ) {}

  async insertLeagueConfigs(): Promise<void> {
    const leagues = await this.configRepository.find({});

    for (const leagueConfig of leagues) {
      const leagueEntity = await this.leagueRepository.findOne({
        name: leagueConfig.league,
      });
      if (!leagueEntity) {
        await this.leagueRepository.insert({
          sourceId: '',
          name: leagueConfig.league,
          nation: '',
          enabled: false,
          order: -1,
        });
      }
      // const leagueEntity = await this.leagueRepository.findOne({
      //     league: league.league
      // });
      // if(!leagueEntity){
      //     await this.configRepository.insert(league);
      //     await this.leagueRepository.insert({
      //         name: league.league,
      //         sourceId: league.league,
      //         nation: '',
      //         order: -1
      //     })
      // } else {
      //     leagueEntity.league = league.league;
      //     leagueEntity.path = league.path;
      //     this.configRepository.save(leagueEntity);
      // }
    }
  }

  async mapTeams(): Promise<TeamEntity[]> {
    const configs = await this.configRepository.find();
    const dbTeams = await this.teamRepository.find();
    const teams = [];
    for (const config of configs) {
      const league = await this.leagueRepository.findOne({
        name: config.league,
      });
      const data = await this.httpClient
        .get<TeamEntity[]>(
          env.SCRAPER_SERVICE + '/league?league=' + config.path,
        )
        .toPromise();
      for (const team of data.data) {
        if (dbTeams.find((f) => f.name === team.name)) {
          continue;
        }
        team.league = { id: league.id } as any;
        this.teamRepository.insert(team);
      }
      teams.push(
        ...data.data.map((team) => {
          const res: TeamEntity = {
            ...team,
          };
          res.league = {
            sourceId: config.league,
            name: config.league,
            nation: '',
          } as any;

          return res;
        }),
      );
    }
    return teams;
  }

  async mapResults(): Promise<void> {
    const configs = await this.configRepository.find();
    const matches = await this.scrapMatches.find();
    for (const config of configs) {
      console.log(config.league);
      try {
        const data = await this.httpClient
          .get(env.SCRAPER_SERVICE + '/matches', {
            params: {
              league: config.path + '/risultati',
              'league-name': config.league,
            },
          })
          .toPromise();
        //const data = await this.httpClient.get<MatchEntity[]>(env.SCRAPER_SERVICE + '/results?league=' + config.path).toPromise();
        console.log(data.data);
      } catch (er) {
        console.log(er);
      }
      //matches?league=calcio/spagna/laliga/risultati/&league-name=La liga

      // for(const match of data.data){

      //     if(matches.find(f => f.sourceId === match.sourceId)) {
      //         continue;
      //     } else {
      //         const row = await this.statsRepository.insert({
      //             home: match.stats.home,
      //             away: match.stats.away
      //         });
      //         match.stats = row.generatedMaps[0] as any;
      //         match.home = await this.teamRepository.findOne({name: match.home.name});
      //         match.away = await this.teamRepository.findOne({name: match.away.name});
      //         await this.matchRepository.insert(match);
      //     }
      // }
    }
  }
}
