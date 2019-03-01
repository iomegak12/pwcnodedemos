import { SingleNodeHost } from "./single-node-host";

class ClusterNodeHost {
  constructor(portNumber) {
    if (!portNumber) {
      throw new Error(ErrorConstants.INVALID_LISTENER_PORT);
    }

    this.portNumber = portNumber;
  }

  startCluster() {
    const cluster = require("cluster");
    const os = require("os");
    const numCpus = os.cpus().length;

    if (cluster.isMaster) {
      for (let index = 0; index < numCpus; index++) {
        const worker = cluster.fork();

        worker.on("online", () =>
          console.log(`Worker ${worker.process.pid} Started ...`)
        );
      }
    } else {
      const host = new SingleNodeHost(this.portNumber);

      host.startServer().then(() => console.log("REST Service Started ..."));
    }
  }
}

export {
    ClusterNodeHost
};

