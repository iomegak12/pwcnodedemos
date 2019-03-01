import { ObjectFormatter } from "../utilities";

class Order {
    constructor(orderId, orderDate, customerId, billingAddress, shippingAddress, units, amount) {
        [
            this.orderId,
            this.orderDate, this.customerId,
            this.billingAddress, this.shippingAddress,
            this.units, this.amount
        ] = arguments;
    }

    toString() {
        return ObjectFormatter.format(this);
    }
}

export {
    Order
};
