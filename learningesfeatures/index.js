import { CustomerService } from "./services";

class MainClass {
  static main() {
    MainClass.process();

    console.log(
      "This line should be printed immediately the call to process() is made!"
    );
  }

  static async process() {
    try {
      let customerService = new CustomerService();
      let windSearchString = "wind";
      let workSearchString = "work";
      let workPromise = customerService.getCustomersByName(workSearchString);
      let windPromise = customerService.getCustomersByName(windSearchString);

      let results = await Promise.all([workPromise, windPromise]);

      for (let result of results) {
        for (let customer of result) {
          console.log(customer.toString());
        }

        console.log(".......................");
      }

      results.forEach(result => {
        result.forEach(customer => {
          console.log(customer.toString());
        });
      });
    } catch (error) {
      console.log("Error Occurred, Details : " + error.message);
    }
  }
}

MainClass.main();
