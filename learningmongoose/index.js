import { CustomerService } from "./services";

class MainClass {
  static async main() {
    try {
      let customerService = new CustomerService();
      let searchString = "till";
      let filteredCustomers = await customerService.getCustomersByName(
        searchString
      );

      filteredCustomers.forEach(customer =>
        console.log(
          `${customer.customerId}, ${customer.fullName}, ${customer.status}`
        )
      );
    } catch (error) {
      console.log("Error Occurred, Details : " + error.message);
    }
  }
}

MainClass.main();
