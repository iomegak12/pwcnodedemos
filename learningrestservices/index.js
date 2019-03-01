import { ClusterNodeHost } from "./hosting";

const DEFAULT_PORT = 9090;

class MainClass {
  static main() {
    const portNumber = process.env.LISTENER_PORT || DEFAULT_PORT;
    const clusterNodeHost = new ClusterNodeHost(portNumber);

    clusterNodeHost.startCluster();
  }
}

MainClass.main();
