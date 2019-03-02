import os from "os";
import cluster from "cluster";
import { SingleNodeHost } from "./single-node-host";

const DEFAULT_PORT = 80;
const DEFAULT_GLOBAL_SECRET_KEY = "PwC,Bangalore";

class ClusterNodeHost {
  constructor() {
    this.noOfCpus = os.cpus().length;
  }

  startCluster() {
    const promise = new Promise((resolve, reject) => {
      if (cluster.isMaster) {
        for (let index = 0; index < this.noOfCpus; index++) {
          const worker = cluster.fork();

          worker.on("online", () => {
            console.log(`Worker ${worker.process.pid} is Running ...`);
          });

          worker.on("exit", () => {
            console.log(`Worker ${worker.process.pid} Died!`);
          });
        }
      } else {
        const portNumber = process.env.LISTENER_PORT || DEFAULT_PORT;
        const globalSecretKey =
          process.env.GLOBAL_SECRET_KEY || DEFAULT_GLOBAL_SECRET_KEY;
        const host = new SingleNodeHost(portNumber, globalSecretKey);

        host.startServer().then(() => {
          console.log("REST Service Started Successfully ...");
        });

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

      resolve();
    });

    return promise;
  }
}

export { ClusterNodeHost };
