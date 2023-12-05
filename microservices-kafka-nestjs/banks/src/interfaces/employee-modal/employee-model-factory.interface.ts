import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";
import { IEmployeeModel } from "./employee-model.interface";

export interface IEmployeeModelFactory {
  getEmployeeModel(model: EMPLOYEE_MODEL_TYPES): Promise<IEmployeeModel>;
}
