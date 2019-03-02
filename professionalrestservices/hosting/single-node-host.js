import http from "http";
import express from "express";
import bodyParser from "body-parser";
import socketIO from "socket.io";
import expressJwt from "express-jwt";
import morgan from "morgan";
import passport from "passport";
import { BearerStrategy } from "passport-azure-ad";

import { ErrorConstants, HttpConstants } from "../constants";
import { CustomerRouter, AuthenticationRouter } from "../routing";
import { PushNotificationsService } from "../services";

const STATIC_CONTENT_FOLDER = "public";
const CUSTOMERS_API_BASE_URL = "/api/customers";
const AUTH_API_BASE_URL = "/authenticate";
const azureADOptions = {
  identityMetadata:
    "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration/",
  clientID: "80b82b7b-8b93-47b0-b366-27a58af88db6",
  validateIssuer: false,
  loggingLevel: "warn",
  passReqToCallback: false
};

const bearerStrategy = new BearerStrategy(azureADOptions, function(
  token,
  done
) {
  done(null, {}, token);
});

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
    this.expressApp.use(morgan("dev"));
    this.expressApp.use(passport.initialize());

    passport.use(bearerStrategy);

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

    this.expressApp.get(
      "/hello",
      passport.authenticate("oauth-bearer", {
        session: false
      }),
      (req, res) => {
        var claims = req.authInfo;

        console.log("User info: ", req.user);
        console.log("Validated claims: ", claims);

        res.status(200).json({ name: claims["name"] });
      }
    );

    this.expressApp.get("/all", (request, response) => {
      const customers = [
        { id: 101, name: "Rajesh" },
        { id: 102, name: "Rakesh" },
        { id: 103, name: "Ramesh" },
        { id: 104, name: "Mahesh" },
        { id: 105, name: "Dinesh" },
        { id: 106, name: "Suresh" }
      ];

      response.status(HttpConstants.OK).send(customers);
    });
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
