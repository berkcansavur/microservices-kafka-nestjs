import { EmployeeModels } from "./employee-models";

export const EmployeeModelMap = {
  provide: "EMPLOYEE_MODEL",
  useClass: EmployeeModels,
};
