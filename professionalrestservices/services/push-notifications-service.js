import { ErrorConstants } from "../constants";

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 1000000;

class PushNotificationsService {
  constructor(socketIOServer) {
    if (!socketIOServer) {
      throw new Error(ErrorConstants.INVALID_SOCKET_SERVER_DEFINITION);
    }

    this.socketIOServer = socketIOServer;
    this.socketIOServer.on("connection", socketClient => {
      const socketClientId = Math.floor(
        Math.random() * (DEFAULT_MAX - DEFAULT_MIN) + DEFAULT_MIN
      );

      socketClient.clientId = socketClientId;

      console.log(`Socket Client ${socketClientId} Connected ...`);

      socketClient.on("disconnect", () => {
        console.log(`Socket Client ${socketClientId} Disconnected ...`);
      });
    });
  }

  broadcast(eventName, eventData) {
    const validation = eventName && eventData;

    if (validation) {
      this.socketIOServer.emit(eventName, eventData);
    }
  }
}

export { PushNotificationsService };
