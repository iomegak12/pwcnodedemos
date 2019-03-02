import { UserProfile } from "../models";
import { ErrorConstants } from "../constants/error-constants";

class UserProfileService {
  constructor() {
    this.userProfiles = [
      new UserProfile(
        "USR100011",
        "admin@123",
        "user100011@info.com",
        "Executive",
        "IT"
      ),
      new UserProfile(
        "USR100012",
        "admin@123",
        "user100012@info.com",
        "Executive",
        "IT"
      ),
      new UserProfile(
        "USR100013",
        "admin@123",
        "user100013@info.com",
        "Executive",
        "IT"
      ),
      new UserProfile(
        "USR100014",
        "admin@123",
        "user100014@info.com",
        "Executive",
        "IT"
      ),
      new UserProfile(
        "USR100015",
        "admin@123",
        "user100015@info.com",
        "Executive",
        "IT"
      ),
      new UserProfile(
        "USR100016",
        "admin@123",
        "user100016@info.com",
        "Executive",
        "IT"
      ),
      new UserProfile(
        "USR100017",
        "admin@123",
        "user100017@info.com",
        "Executive",
        "IT"
      )
    ];
  }

  getUserProfile(userProfileId) {
    let filteredProfile = {};

    if (!userProfileId) {
      throw new Error(ErrorConstants.INVALID_ID);
    }

    for (let userProfile of this.userProfiles) {
      if (userProfile.userProfileId === userProfileId) {
        filteredProfile = userProfile;
        break;
      }
    }

    return filteredProfile;
  }
}

export { UserProfileService };
