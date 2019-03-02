import { format } from "path";

class UserProfile {
  constructor(userProfileId, password, email, title, department) {
    [
      this.userProfileId,
      this.password,
      this.email,
      this.title,
      this.department
    ] = arguments;
  }

  toString() {
    const formattedMessage = `${tihs.userProfileId}, ${this.email}, ${
      this.tihs
    }, ${this.department}`;

    return formattedMessage;
  }
}

export { UserProfile };
