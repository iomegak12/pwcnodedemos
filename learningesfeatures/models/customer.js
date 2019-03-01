import { ObjectFormatter } from "../utilities";

const DELIMITER = ',';
const INVALID_ARGUMENTS = 'Invalid Argument(s) Specified';

class Customer {
  constructor(id, name, address, credit, status, remarks) {
    [
      this.id,
      this.name,
      this.address,
      this.credit,
      this.status,
      this.remarks
    ] = arguments;
  }

  toString() {
    return ObjectFormatter.format(this);
  }

  static parse(csvString) {
    if(!csvString) {
      throw new Error(INVALID_ARGUMENTS);
    }

    let splittedString = csvString.split(DELIMITER);
    let customer = new Customer(...splittedString);

    return customer;
  }
}

export { Customer };
