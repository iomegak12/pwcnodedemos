import http from "http";
import express from "express";
import bodyParser from "body-parser";
import socketIO from "socket.io";

import { ErrorConstants } from "../constants";
import { CustomerRouter } from "../routing";
import { PushNotificationsService } from "../services";

const STATIC_CONTENT_FOLDER = "public";
const CUSTOMERS_API_BASE_URL = "/api/customers";

class SingleNodeHost {
  constructor(portNumber) {
    if (!portNumber) {
      throw new Error(ErrorConstants.INVALID_LISTENER_PORT);
    }

    this.portNumber = portNumber;
    this.expressApp = express();
    this.httpServer = http.createServer(this.expressApp);
    this.socketServer = socketIO.listen(this.httpServer);
    this.pushNotificationsService = new PushNotificationsService(
      this.socketServer
    );
    this.customerRouter = new CustomerRouter(this.pushNotificationsService);

    this.initializeMiddleware();
  }

  initializeMiddleware() {
    this.expressApp.use(this.applyCors);
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(CUSTOMERS_API_BASE_URL, this.customerRouter.Router);
    this.expressApp.use(express.static(STATIC_CONTENT_FOLDER));
  }

  applyCors(request, response, next) {
    response.header("Access-Control-Allow-Credentials", "true");
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Methods", "*");
    response.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    next();
  }

  startServer() {
    const promise = new Promise((resolve, reject) => {
      this.httpServer.listen(this.portNumber, () => {
        resolve();
      });
    });

    return promise;
  }

  stopServer() {
    const promise = new Promise((resolve, reject) => {
      this.httpServer.close(() => resolve());
    });

    return promise;
  }
}

export { SingleNodeHost };
