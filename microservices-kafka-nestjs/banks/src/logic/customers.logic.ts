import { Customer } from "src/schemas/customers.schema";

export class CustomersLogic {
  static isObjectValid(object: object) {
    if (!object) {
      throw new Error(`Invalid object`);
    }
    return object;
  }
  static isCustomerHasCustomerRepresentative(customer: Customer): boolean {
    if (customer.customerRepresentative !== null) {
      return true;
    }
    return false;
  }
}
