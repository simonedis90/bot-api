import { Injectable } from "@nestjs/common";

const { Telegraf } = require("telegraf");

// const x = bot.telegram.sendMessage('@betpension', "ciao");
// console.log(x);
// x.then((f) => {
//   console.log(f)
// }).catch(f => console.log(f, "err"))

@Injectable()
export class TelegramService {

  bot;

  init() {

    const bot = new Telegraf("5075485876:AAFWyF1JV1UjYd89vTPI8CWLH3cSJpsjqj8", {
      channelMode: true
    });

    this.bot = bot;
    let text;
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
    this.bot.telegram.sendMessage('-1001780824586', message);
  }

  checkHealth() {
    console.log('healthcheck')
    this.bot.telegram.sendMessage('-1001780824586', "health checked ok").then(
      d => {
        console.log(d);
      }
    );
  }

  sendImage(imagestring) {
    console.log(imagestring)
    this.bot.telegram.sendPhoto('-1001780824586', {source: Buffer.from(imagestring, 'base64')} );
  }
}
