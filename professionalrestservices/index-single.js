import { SingleNodeHost } from "./hosting";

const DEFAULT_PORT = 9090;
const DEFAULT_GLOBAL_SECRET_KEY = "PwC,Bangalore";

class MainClass {
  static main() {
    const portNumber = process.env.LISTENER_PORT || DEFAULT_PORT;
    const globalSecretKey =
      process.env.GLOBAL_SECRET_KEY || DEFAULT_GLOBAL_SECRET_KEY;
    const host = new SingleNodeHost(portNumber, globalSecretKey);

    host
      .startServer()
      .then(() => console.log("REST Service Host Started Successfully!"));

    const shutdown = () => {
      host.stopServer().then(() => {
        console.log("REST Service Host Stopped Successfully!");

        process.exit();
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    process.on("exit", shutdown);
  }
}

MainClass.main();
