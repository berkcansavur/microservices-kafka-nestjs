import { Inject, Injectable } from "@nestjs/common";
import { IEmployeeModelFactory } from "src/interfaces/employee-modal/employee-model-factory.interface";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";
import { EmployeeModelMap } from "../models/employee-models/employee-model.map";

@Injectable()
export class EmployeeModelFactory implements IEmployeeModelFactory {
  constructor(
    @Inject("EMPLOYEE_MODEL")
    private readonly employeeModelMap = EmployeeModelMap,
  ) {}
  async getEmployeeModel(model: EMPLOYEE_MODEL_TYPES) {
    const employeeModel = this.employeeModelMap[model];
    if (!employeeModel) {
      throw new Error("Employee Type is not valid.");
    }
    return employeeModel.call(this.employeeModelMap);
  }
}
