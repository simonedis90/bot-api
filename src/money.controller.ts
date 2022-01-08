import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { OUTCOME, WALLET } from "./database2_0/provider";
import { Repository } from "typeorm";
import { Wallet } from "./database2_0/entities/wallet";
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Outcome } from "./database2_0/entities/outcome";
import { MessageDTO } from "./models/response.dto";
import { TelegramService } from "./services/telegram";

@ApiTags("money-management")
@Controller("/money-management")
export class MoneyController {

  constructor(@Inject(WALLET) public walletRepository: Repository<Wallet>,
              @Inject(OUTCOME) public outcomeRepository: Repository<Outcome>,
              private telegram: TelegramService) {
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
    outcome.wallet = { id: walletId } as any;
    const exists = await this.outcomeRepository.findOne({
      betId: outcome.betId
    });
    if (!exists) {
      const result = await this.outcomeRepository.insert(outcome);
      return result.generatedMaps[0];
    }
    return null;
  }

  @ApiParam({
    type: Number,
    name: "id"
  })
  @ApiBody({
    type: MessageDTO
  })
  @ApiQuery({
    type: String,
    name: "subject"
  })
  @Post("/message/:id")
  async sendMessage(@Param("id") walletId, @Body() body: MessageDTO) {
    const data = await this.walletRepository.createQueryBuilder("wallet")
      .leftJoinAndSelect("wallet.outcomes", "outcomes")
      .where("wallet.id = :id")
      .setParameter("id", walletId).getOne();

    function sameDay(a: Date, b: Date) {
      return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
    }

    const profit = data.outcomes.filter(f => f.betId !== "CASH_INCREASE")
      .map(f => Number(f.value)).reduce((tot, va) => tot + va, 0);

    const cash = Number(data.cash) + data.outcomes
      .map(f => Number(f.value)).reduce((tot, va) => tot + va, 0);

    const daily = data.outcomes.filter(f => sameDay(new Date(f.date), new Date()) && f.betId !== "CASH_INCREASE")
      .map(f => Number(f.value))
      .reduce((tot, va) => tot + va, 0);

    var nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "simonedisantedev@gmail.com",
        pass: "Fmsh5ogge2@"
      }
    });

    try {
      const verify = await transporter.verify();
    } catch (e) {
      console.log(e);
    }

    const images = body.images.map(f => `<img src="${f}">`);

    let html = `🚀 <b>Profitto complessivo ${profit.toFixed(2)} €, profitto oggi ${daily.toFixed(2)} €, cassa totale ${cash.toFixed(2)} € - Ringraziar DSS - </b> <br> 

`;

    //this.telegram.textChannel(html);

    body.images.forEach(
      f => {
        this.telegram.sendImage(f.replace('data:image/png;base64,', ''));
      }
    )

    var mailOptions = {
      from: "simonedisante@gmail.com",
      to: "nicholas.angelucci@gmail.com,antobru28@gmail.com,simonedisante@gmail.com,stefano@oddastudio.com,ugodiscenza@gmail.com,biagiomanocchio@gmail.com",
      subject: new Date().toLocaleString().split(",").shift() + `🎄🎅🏿 - P&C - Cos'é quest software 🚀 ` ,
      html,
      attachments: body.images.map(f => {
        return {
          path: f
        }
      })
      //text: `🚀 Profitto complessivo ${profit.toFixed(2)} €, profitto oggi ${daily.toFixed(2)} €, cassa totale ${cash.toFixed(2)} € - Ringraziar DSS -`
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }


}
