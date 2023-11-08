import { Component } from "@angular/core";
import { EmployeeService } from "src/app/services/employee.service";

@Component({
  selector: "[app-customers]",
  templateUrl: "./customers.component.html",
})
export class CustomersComponent {
  constructor(private readonly employeeService: EmployeeService) {}
}
