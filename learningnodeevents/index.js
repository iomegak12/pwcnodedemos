const EventEmitter = require("events");

const MIN_ORDER_AMOUNT = 1;
const DEFAULT_TIMEOUT = 1000;
const ORDER_PROCESSING_EVENT = "OrderProcessingCompleted";

class OrderProcessor extends EventEmitter {
  process(order) {
    if (!order) {
      throw new Error("Invalid Order Information Specified!");
    }

    setTimeout(() => {
      console.log("Order Processing Initiated ...");

      let validation =
        order.orderId &&
        order.orderDate <= new Date() &&
        order.amount >= MIN_ORDER_AMOUNT;

      if (!validation) {
        throw new Error("Order Processing Business Validation Failed!");
      }

      console.log("Order Processing Completed ...");

      this.emit(ORDER_PROCESSING_EVENT, {
        orderId: order.orderId,
        orderDate: order.orderDate,
        status: true
      });
    }, DEFAULT_TIMEOUT);
  }
}

function main() {
  try {
    let processor = new OrderProcessor();
    let order = {
      orderId: "ORD10001",
      orderDate: new Date(),
      customer: "Northwind",
      amount: 23000,
      remarks: "Simple Order"
    };

    processor.on(ORDER_PROCESSING_EVENT, result => {
      console.log(
        `Order Processing Event Handled ... ${JSON.stringify(result)}`
      );
    });

    processor.process(order);
  } catch (error) {
    console.error(`Error Occurred, Details :  ${error.message}`);
  }
}

main();

