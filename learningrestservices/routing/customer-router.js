import express from "express";
import { CustomerService } from "../services";
import { HttpConstants, ErrorConstants } from "../constants";

const ROUTER_SYMBOL = Symbol("Customer Router Symbol");
const customerService = new CustomerService();
const NO_RECORDS = "No Record(s) Found!";
const MIN_SEARCH_STR_LENGTH = 3;
const UNKNOWN_ERROR = "Unable to Add a New Customer Record!";

class CustomerRouter {
  constructor() {
    this[ROUTER_SYMBOL] = express.Router();

    this.initializeRouter();
  }

  initializeRouter() {
    let router = this[ROUTER_SYMBOL];

    router.get("/all", async (request, response) => {
      let customers = [
        {
          id: 11,
          name: "Northwind 1",
          address: "Bangalore",
          credit: 23000,
          status: true,
          email: "info@email.com",
          phone: "080-49834343",
          remarks: "Simple"
        },
        {
          id: 12,
          name: "Northwind 2",
          address: "Bangalore",
          credit: 23000,
          status: true,
          email: "info@email.com",
          phone: "080-49834343",
          remarks: "Simple"
        },
        {
          id: 13,
          name: "Northwind 3",
          address: "Bangalore",
          credit: 23000,
          status: true,
          email: "info@email.com",
          phone: "080-49834343",
          remarks: "Simple"
        },
        {
          id: 14,
          name: "Northwind 4",
          address: "Bangalore",
          credit: 23000,
          status: true,
          email: "info@email.com",
          phone: "080-49834343",
          remarks: "Simple"
        },
        {
          id: 15,
          name: "Northwind 5",
          address: "Bangalore",
          credit: 23000,
          status: true,
          email: "info@email.com",
          phone: "080-49834343",
          remarks: "Simple"
        },
        {
          id: 16,
          name: "Northwind 6",
          address: "Bangalore",
          credit: 23000,
          status: true,
          email: "info@email.com",
          phone: "080-49834343",
          remarks: "Simple"
        },
        {
          id: 17,
          name: "Northwind 7",
          address: "Bangalore",
          credit: 23000,
          status: true,
          email: "info@email.com",
          phone: "080-49834343",
          remarks: "Simple"
        },
        {
          id: 18,
          name: "Northwind 8",
          address: "Bangalore",
          credit: 23000,
          status: true,
          email: "info@email.com",
          phone: "080-49834343",
          remarks: "Simple"
        }
      ];

      response.status(HttpConstants.OK).send(customers);
    });

    router.get("/", async (request, response) => {
      try {
        let customers = await customerService.getCustomers();

        if (!customers) {
          response.status(HttpConstants.OK).send({
            message: NO_RECORDS
          });

          return;
        }

        response.status(HttpConstants.OK).send(customers);
      } catch (error) {
        response.status(HttpConstants.SERVER_ERROR).send(error);
      }
    });

    router.get("/search/:searchString", async (request, response) => {
      const searchString = request.params.searchString;
      const validation =
        searchString && searchString.length >= MIN_SEARCH_STR_LENGTH;

      if (!validation) {
        response.status(HttpConstants.BAD_REQUEST);

        return;
      }

      try {
        const filteredCustomers = await customerService.getCustomersByName(
          searchString
        );

        response.status(HttpConstants.OK).send(filteredCustomers);
      } catch (error) {
        response.status(HttpConstants.SERVER_ERROR).send(error);
      }
    });

    router.get("/detail/:customerId", async (request, response) => {
      const customerId = parseInt(request.params.customerId);

      if (!customerId) {
        response.status(HttpConstants.BAD_REQUEST).send({
          error: ErrorConstants.INVALID_ID
        });

        return;
      }

      try {
        const filteredCustomer = await customerService.getCustomerById(
          customerId
        );

        if (!filteredCustomer) {
          response.status(HttpConstants.NOT_FOUND);

          return;
        }

        response.status(HttpConstants.OK).send(filteredCustomer);
      } catch (error) {
        response.status(HttpConstants.SERVER_ERROR).send(error);
      }
    });

    router.post("/", async (request, response) => {
      const body = request.params;
      const validation =
        body &&
        body.customerId &&
        body.fullName &&
        body.address &&
        body.email &&
        body.phone &&
        body.remarks;

      if (!validation) {
        response.status(HttpConstants.BAD_REQUEST);

        return;
      }

      try {
        const savedRecord = await customerService.saveCustomerRecord(body);

        if (savedRecord._id) {
          response.status(HttpConstants.CREATED).send(savedRecord);
        } else {
          response.status(HttpConstants.SERVER_ERROR).send({
            message: UNKNOWN_ERROR
          });
        }
      } catch (error) {
        response.status(HttpConstants.SERVER_ERROR).send(error);
      }
    });
  }

  get Router() {
    return this[ROUTER_SYMBOL];
  }
}

export { CustomerRouter };
