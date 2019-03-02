import { ClusterNodeHost } from "./hosting";

class MainClass {
  static main() {
    const host = new ClusterNodeHost();

    host.startCluster().then(() => {
      console.log("Cluster Started Successfully!");
    });
  }
}

MainClass.main();

