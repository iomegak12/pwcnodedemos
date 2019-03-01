import { SingleNodeHost } from "./hosting";

const DEFAULT_PORT = 9090;

class MainClass {
  static main() {
    const portNumber = process.env.LISTENER_PORT || DEFAULT_PORT;
    const host = new SingleNodeHost(portNumber);

    host
      .startServer()
      .then(() => console.log("REST Service Host Started Successfully!"));

    const shutdown = () => {
      host
        .stopServer()
        .then(() => console.log("REST Service Host Stopped Successfully!"));

      process.exit();
    };

    process.on("SIGTERM", shutdown);
    process.on("exit", shutdown);
  }
}

MainClass.main();
