import { Customer } from "../models";

const CUSTOMERS_PROP_SYMBOL = Symbol("Customers Property");
const DEFAULT_TIMEOUT = 2000;
const MIN_INDEX_POS = 0;

class CustomerService {
  constructor() {
    this[CUSTOMERS_PROP_SYMBOL] = new Set();

    this[CUSTOMERS_PROP_SYMBOL].add(
      new Customer(10, "Northwind", "Bangalore", 12000, true, "Simple CR")
    );
    this[CUSTOMERS_PROP_SYMBOL].add(
      new Customer(11, "Southwind", "Bangalore", 12000, true, "Simple CR")
    );
    this[CUSTOMERS_PROP_SYMBOL].add(
      new Customer(12, "Eastwind", "Bangalore", 12000, true, "Simple CR")
    );
    this[CUSTOMERS_PROP_SYMBOL].add(
      new Customer(13, "Westwind", "Bangalore", 12000, true, "Simple CR")
    );
    this[CUSTOMERS_PROP_SYMBOL].add(
      new Customer(14, "Adventureworks", "Bangalore", 12000, true, "Simple CR")
    );
  }

  *[Symbol.iterator]() {
    for (let customer of this[CUSTOMERS_PROP_SYMBOL]) {
      yield customer;
    }
  }

  getCustomersByName(searchString) {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        let filteredCustomers = [];

        for(let customer of this[CUSTOMERS_PROP_SYMBOL]) {
            if(customer.name.indexOf(searchString) >= MIN_INDEX_POS) {
                filteredCustomers.push(customer);
            }
        }

        if (filteredCustomers) {
          resolve(filteredCustomers);
        } else {
          reject({
            message: "Search Returned No Results"
          });
        }
      }, DEFAULT_TIMEOUT);
    });

    return promise;
  }
}

export { CustomerService };
