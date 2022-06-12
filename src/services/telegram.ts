import { Inject, Injectable } from "@nestjs/common";
import { WALLET } from "../database2_0/provider";
import { Repository } from "typeorm";
import { Wallet } from "../database2_0/entities/wallet";

const { Telegraf, Markup } = require("telegraf");

enum reportType {
  daily,
  weekly,
  monthly,
  all,
  ended,
  settled
}

// const x = bot.telegram.sendMessage('@betpension', "ciao");
// console.log(x);
// x.then((f) => {
//   console.log(f)
// }).catch(f => console.log(f, "err"))

@Injectable()
export class TelegramService {

  bot;

  constructor(@Inject(WALLET) public walletRepository: Repository<Wallet>) {
  }

  init() {


    const bot = new Telegraf("5075485876:AAFWyF1JV1UjYd89vTPI8CWLH3cSJpsjqj8", {
      channelMode: true
    });

    this.bot = bot;
    let text;

    bot.on("message", async ctx => {
      debugger;
      const tgChatId = ctx.message.chat.id;
      ctx.reply("Yoo!", {
        reply_markup: {
          inline_keyboard: [
            /* Inline buttons. 2 side-by-side */
            [
              { text: "Daily", callback_data: reportType.daily },
              { text: "Weekly", callback_data: reportType.weekly },
              { text: "Monthly", callback_data: reportType.monthly },
              { text: "All", callback_data: reportType.all }
            ],
            [
              { text: "Ended ⚽️", callback_data: reportType.ended },
              { text: "Settled ⏱", callback_data: reportType.settled }
            ]
          ]
        }
      });
    });

    bot.action(/.+/, async (ctx) => {
      return ctx.answerCbQuery(await this.report(Number(ctx.match[0])));
    });

    bot.hears("health", (context) => {
      context.reply("health checked");
      this.checkHealth();
    });
    bot.start((context) => {
      console.log("Servizio avviato...");
      context.reply("Servizio ECHO avviato");
    });
    bot.on("text", context => {
      text = context.update.message.text;
      context.reply("Hai scritto: " + text);
    });


    bot.launch();
  }

  textChannel(message: string) {
    this.bot.telegram.sendMessage("-1001780824586", message);
  }

  checkHealth() {
    console.log("healthcheck");
    this.bot.telegram.sendMessage("-1001780824586", "health checked ok").then(
      d => {
        console.log(d);
      }
    );
  }

  sendImage(imagestring) {
    console.log(imagestring);
    this.bot.telegram.sendPhoto("-1001780824586", { source: Buffer.from(imagestring, "base64") });
  }

  async report(period: reportType): Promise<string> {
    const walletId = 4;
    let message = "";
    const data = await this.walletRepository.createQueryBuilder("wallet")
      .leftJoinAndSelect("wallet.outcomes", "outcomes")
      .where("wallet.id = :id")
      .setParameter("id", walletId).getOne();

    function sameDay(a: Date, b: Date) {
      return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
    }
    const profit = () => data.outcomes.filter(f => f.betId !== "CASH_INCREASE")
      .map(f => Number(f.value)).reduce((tot, va) => tot + va, 0);

    const cash = () => Number(data.cash) + data.outcomes
      .map(f => Number(f.value)).reduce((tot, va) => tot + va, 0);

    const daily = () => data.outcomes.filter(f => sameDay(new Date(f.date), new Date()) && f.betId !== "CASH_INCREASE")
      .map(f => Number(f.value))
      .reduce((tot, va) => tot + va, 0);

    switch (period) {
      case reportType.daily:
        message = 'Profitto giornaliero' + daily().toFixed(2) + ' €'
        break;
      case reportType.weekly:
        break;
      case reportType.monthly:
        break;
      case reportType.all:
        break;
    }



    return message;
  }

}
