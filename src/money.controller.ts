import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { OUTCOME, WALLET } from "./database2_0/provider";
import { Repository } from "typeorm";
import { Wallet } from "./database2_0/entities/wallet";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Outcome } from "./database2_0/entities/outcome";

@ApiTags("money-management")
@Controller("/money-management")
export class MoneyController {

  constructor(@Inject(WALLET) public walletRepository: Repository<Wallet>,
              @Inject(OUTCOME) public outcomeRepository: Repository<Outcome>) {
  }

  @Get()
  async moneyManagements() {
    return await this.walletRepository.find(
      {
        relations: ["outcomes"]
      }
    );
  }

  @ApiResponse({
    status: 200,
    type: Wallet
  })
  @ApiParam({
    type: Number,
    name: "id"
  })
  @Get("/:id")
  async moneyManagement(@Param("id") id) {
    // const eventsDb = await this.eventRepository
    //   .createQueryBuilder("events")
    //   .leftJoinAndSelect("events.competition", "competition")
    //   .leftJoinAndSelect("events.odds", "odds")
    //   .leftJoinAndSelect("odds.selection", "selection")
    //   .where("events.sourceId IN (:...ids)")
    //   .setParameter("ids", this.mappedEvents).getMany();
    const query = await this.walletRepository.createQueryBuilder("wallet")
      .leftJoinAndSelect("wallet.outcomes", "outcomes")
      .where("wallet.id = :id")
      .setParameter("id", id).getOne();
    return query;
  }

  @ApiResponse({
    status: 201,
    type: Outcome
  })
  @ApiParam({
    type: Number,
    name: "id"
  })
  @ApiBody({
    type: Outcome
  })
  @Post("/:id")
  async addOutcome(@Param("id") walletId, @Body() outcome: Outcome) {
    outcome.wallet = {id: walletId} as any;
    const exists = await this.outcomeRepository.findOne({
      betId: outcome.betId
    });
    if(!exists) {
      const result = await this.outcomeRepository.insert(outcome);
      return result.generatedMaps[0];
    }
    return null;
  }
}
