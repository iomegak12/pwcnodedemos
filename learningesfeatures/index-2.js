import { ObjectFormatter } from "./utilities";
import { Customer } from "./models/customer";
import { CustomerService } from "./services";

class MainClass {
  static main() {
    try {
      let obj = {
        id: 10,
        name: "PwC",
        location: "Bangalore"
      };

      let formattedMessage = ObjectFormatter.format(obj);

      console.log(formattedMessage);

      let csvString = "10,Northwind,Bangalore,12000,true,Simple Record";
      let customer = Customer.parse(csvString);

      console.log(customer instanceof Customer);
      console.log(customer.credit);

      let customerService = new CustomerService();

      for (let customer of customerService) {
        console.log(customer.toString());
      }

      console.log("Searching ...");

      let searchString = "work";
      let workPromise = customerService.getCustomersByName(searchString);
      let windPromise = customerService.getCustomersByName("wind");

      workPromise.catch(error =>
        console.error("This is work promise related error1")
      );

      Promise.all([workPromise, windPromise]).then(
        results => {
          for (let result of results) {
            for (let customer of result) {
              console.log(customer.toString());
            }

            console.log(".........................");
          }
        },
        error => {
          console.log("Error Occurred, But Which Promise I dont know!");
        }
      );
    } catch (error) {
      console.log(`Error Occurred, Details : ${error.message}`);
    }
  }
}

MainClass.main();
