import { ErrorConstants } from "../constants";
import { UserProfileService } from "./user-profile-service";

class AuthenticationService {
  constructor(userProfileService) {
    this.userProfileService = userProfileService || new UserProfileService();
  }
  
  authenticate(userName, password) {
    let promise = new Promise((resolve, reject) => {
      const validation = userName && password;

      if (!validation) {
        throw new Error(ErrorConstants.INVALID_CREDENTIALS);
      }

      const userProfile = this.userProfileService.getUserProfile(userName);
      const authenticationStatus =
        userProfile &&
        userProfile.userProfileId === userName &&
        userProfile.password &&
        userProfile.password === password;

      if (authenticationStatus) {
        resolve(authenticationStatus);
      } else {
        reject(authenticationStatus);
      }
    });

    return promise;
  }
}

export { AuthenticationService };
