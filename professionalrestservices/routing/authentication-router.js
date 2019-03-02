import express from "express";
import jwt from "jsonwebtoken";
import { HttpConstants, ErrorConstants } from "../constants";
import { AuthenticationService } from "../services/authentication-service";
import { UserProfileService } from "../services/user-profile-service";

const AUTH_ROUTER_SYMBOL = Symbol("Authentication Service Router");
const MIN_USER_NAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 3;
const TEN_MINUTES = "10m";

class AuthenticationRouter {
  constructor(globalSecretKey) {
    if (!globalSecretKey) {
      throw new Error(ErrorConstants.INVALID_SECRET_KEY);
    }

    this[AUTH_ROUTER_SYMBOL] = express.Router();
    this.authenticationService = new AuthenticationService();
    this.userProfileService = new UserProfileService();
    this.globalSecretKey = globalSecretKey;

    this.initializeRouting();
  }

  initializeRouting() {
    const router = this[AUTH_ROUTER_SYMBOL];

    router.post("/", async (request, response) => {
      const body = request.body;
      const userName = body.userName;
      const password = body.password;

      try {
        const validation =
          userName &&
          password &&
          userName.length >= MIN_USER_NAME_LENGTH &&
          password.length >= MIN_PASSWORD_LENGTH;

        if (!validation) {
          response.status(HttpConstants.BAD_REQUEST).send({
            message: ErrorConstants.INVALID_CREDENTIALS
          });

          return;
        }

        const authenticationStatus = await this.authenticationService.authenticate(
          userName,
          password
        );

        if (authenticationStatus) {
          const userProfile = this.userProfileService.getUserProfile(userName);
          const updatedProfile = {
            userProfileId: userProfile.userProfileId,
            email: userProfile.email,
            title: userProfile.title,
            department: userProfile.department
          };

          const token = jwt.sign(updatedProfile, this.globalSecretKey, {
            expiresIn: TEN_MINUTES
          });

          response.status(HttpConstants.OK).send({
            token
          });
        }
      } catch (error) {
        response.status(HttpConstants.UNAUTHORIZED).send(error);
      }
    });
  }

  get Router() {
    return this[AUTH_ROUTER_SYMBOL];
  }
}

export { AuthenticationRouter };
