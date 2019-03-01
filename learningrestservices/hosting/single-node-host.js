import http from "http";
import express from "express";
import bodyParser from "body-parser";

import { ErrorConstants } from "../constants";
import { CustomerRouter } from "../routing";

const CUSTOMERS_API_BASE_URL = "/api/customers";

class SingleNodeHost {
  constructor(portNumber) {
    if (!portNumber) {
      throw new Error(ErrorConstants.INVALID_LISTENER_PORT);
    }

    this.portNumber = portNumber;
    this.customerRouter = new CustomerRouter();
    this.expressApp = express();
    this.httpServer = http.createServer(this.expressApp);

    this.initializeMiddleware();
  }

  initializeMiddleware() {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(CUSTOMERS_API_BASE_URL, this.customerRouter.Router);
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

export {
    SingleNodeHost
};
