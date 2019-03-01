import { ConfigurationManager } from "../config";
import { ErrorConstants } from "../constants";
import { DbManager } from "../db-management/db-manager";

const MIN_SEARCH_LENGTH = 3;

class CustomerService {
  constructor() {
    const connectionString = ConfigurationManager.getConfiguration().getConnectionString();

    if (!connectionString) {
      throw new Error(ErrorConstants.INVALID_CONNECTION_STRING);
    }

    this.connectionString = connectionString;
    this.dbManager = new DbManager();
  }

  async getCustomers() {
    let customers = [];

    try {
      await this.dbManager.connection.connect(this.connectionString, {
        useNewUrlParser: true
      });

      customers = await this.dbManager.customersModel.find({});
    } catch (error) {
      console.error(`Error Occurred, Details ${error.message}`);

      throw error;
    } finally {
      await this.dbManager.connection.disconnect();
    }

    return customers;
  }

  async getCustomersByName(searchString) {
    const validation = searchString && searchString.length >= MIN_SEARCH_LENGTH;

    if (!validation) {
      throw new Error(ErrorConstants.INVLAID_SEARCH_STR_LENGTH);
    }

    let filteredCustomers = [];

    try {
      await this.dbManager.connection.connect(this.connectionString, {
        useNewUrlParser: true
      });

      filteredCustomers = await this.dbManager.customersModel.find({
        fullName: new RegExp(searchString, "i")
      });
    } catch (error) {
      console.error(`Error Occurred, Details : ${error.message}`);

      throw error;
    } finally {
      await this.dbManager.connection.disconnect();
    }

    return filteredCustomers;
  }

  async getCustomerById(id) {
    if (!id) {
      throw new Error(ErrorConstants.INVLAID_ID);
    }

    let filteredCustomer = {};

    try {
      await this.dbManager.connection.connect(this.connectionString, {
        useNewUrlParser: true
      });

      filteredCustomer = await this.dbManager.customersModel.findOne({
        customerId: id
      });
    } catch (error) {
      console.error(`Error Occurred, Details : ${error.message}`);

      throw error;
    } finally {
      await this.dbManager.connection.disconnect();
    }

    return filteredCustomer;
  }
}

export {
    CustomerService
};
