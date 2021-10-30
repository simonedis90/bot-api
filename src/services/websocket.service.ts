import { Injectable } from "@nestjs/common";
import { NewController } from "../new.controller";
import { Subject } from "rxjs";
import { BridgeService } from "./bridge";

@Injectable()
export class WebsocketService {

  private broadCast$: Subject<{ data: any, operation: string }> = new Subject();
  server;
  connections;

  constructor(private bridge: BridgeService) {

    bridge.oddChange$.subscribe(
      odd => {
        this.broadCast(odd, "odd");
      }
    )
    bridge.eventInfo$.subscribe(
      eventInfo => this.broadCast(eventInfo, "eventInfo")
    )

// eslint-disable-next-line @typescript-eslint/no-var-requires
    const WebSocketServer = require("websocket").server;
// eslint-disable-next-line @typescript-eslint/no-var-requires
    const http = require("http");

// eslint-disable-next-line @typescript-eslint/no-empty-function
    const server = http.createServer(function(request, response) {
    });
// eslint-disable-next-line @typescript-eslint/no-empty-function
    server.listen(1371, function() {
    });

    const wsServer = new WebSocketServer({
      httpServer: server
    });

    this.broadCast$.subscribe(
      data => {
        wsServer.connections.forEach(connection => {
          connection.send(JSON.stringify(data));
        });
      }
    );


    wsServer.on("request", async (request) => {
      const connection = request.accept(null, request.origin);

      connection.on("open", async (connection) => {
        console.log('new connection opened')
      });

      connection.on("message", async (message) => {
        const data = JSON.parse(message.utf8Data);
        if (data.command === "subscribe") {
          const req = {
            headers: {
              "x-application": data.identifier.apiKey,
              "x-authentication": data.identifier.auth
            }
          };
          const events = await this.bridge.events(req);
          await this.bridge.register(req);
          connection.send(JSON.stringify({ operation: "events", data: events }));
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      connection.on("close", function(connection) {
        console.log('new connection closed')
      });
    });

  }

  async request(request) {

  }

  async open(connection) {

  }

  async message(message) {

  }

  async close() {

  }

  broadCast(data: any, operation: string) {
    this.broadCast$.next({data, operation});
  }
}
