import http from "http";
import express from "express";
import bodyParser from "body-parser";
import socketIO from "socket.io";
import expressJwt from "express-jwt";

import { ErrorConstants, HttpConstants } from "../constants";
import { CustomerRouter, AuthenticationRouter } from "../routing";
import { PushNotificationsService } from "../services";

const STATIC_CONTENT_FOLDER = "public";
const CUSTOMERS_API_BASE_URL = "/api/customers";
const AUTH_API_BASE_URL = "/authenticate";

class SingleNodeHost {
  constructor(portNumber, globalSecretKey) {
    if (!portNumber) {
      throw new Error(ErrorConstants.INVALID_LISTENER_PORT);
    }

    if (!globalSecretKey) {
      throw new Error(ErrorConstants.INVALID_SECRET_KEY);
    }

    this.portNumber = portNumber;
    this.globalSecretKey = globalSecretKey;
    this.expressApp = express();
    this.httpServer = http.createServer(this.expressApp);
    this.socketServer = socketIO.listen(this.httpServer);
    this.pushNotificationsService = new PushNotificationsService(
      this.socketServer
    );
    this.customerRouter = new CustomerRouter(this.pushNotificationsService);
    this.authenticationRouter = new AuthenticationRouter(this.globalSecretKey);

    this.initializeMiddleware();
  }

  initializeMiddleware() {
    this.expressApp.use((error, request, response, next) => {
      if (error && error.constructor.name === "UnauthorizedError") {
        response.status(HttpConstants.UNAUTHORIZED).send({
          message: ErrorConstants.AUTHORIZED_FAILED
        });

        return;
      }

      next();
    });

    this.expressApp.use(this.applyCors);
    this.expressApp.use(bodyParser.json());

    this.expressApp.use(
      CUSTOMERS_API_BASE_URL,
      expressJwt({
        secret: this.globalSecretKey
      })
    );

    this.expressApp.use(CUSTOMERS_API_BASE_URL, this.customerRouter.Router);
    this.expressApp.use(AUTH_API_BASE_URL, this.authenticationRouter.Router);
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
