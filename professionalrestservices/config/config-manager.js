const DEFAULT_MONGO_HOST = "localhost";
const DEFAULT_MONGO_PORT = 27017;
const DEFAULT_MONGO_DB = "pwctrainingdb";

class ConfigurationManager {
  static getConfiguration() {
    const host = process.env.MONGO_HOST || DEFAULT_MONGO_HOST;
    const port = process.env.MONGO_PORT || DEFAULT_MONGO_PORT;
    const db = process.env.MONGO_DB || DEFAULT_MONGO_DB;

    const configuration = {
      host,
      port,
      db,
      getConnectionString: () => {
        const formattedConnectionString = `mongodb://${host}:${port}/${db}`;

        return formattedConnectionString;
      }
    };

    return configuration;
  }
}

export { ConfigurationManager };
