import { Component, Input } from "@angular/core";
import { IUserProfile } from "src/app/models/user-profile.mode";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "[app-assign-customer-to-representative]",
  templateUrl: "./assign-customer-to-representative.component.html",
})
export class AssignCustomerToRepresentativeComponent {
  @Input() customerProfile: IUserProfile | undefined;
  @Input() customerRepresentativeId: string | undefined;
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly utilsService: UtilsService,
  ) {}
  errorMessage: string | undefined;
  process: string | undefined;
  successMessage: string | undefined;
  //conditions
  isLoggedIn: boolean = false;
  isLoading: boolean = false;

  handleAssignCustomerToRepesentative(): void {
    this.process = this.utilsService.setProcess(
      "Assigning customer to customer representative...",
    );
    this.isLoading = this.utilsService.setLoading(true);
    const customerId = this.customerProfile?.userId as string;
    const customerRepresentativeId = this.customerRepresentativeId as string;
    this.employeeService
      .sendAddCustomerToRepresentativeRequest({
        customerId,
        customerRepresentativeId,
      })
      .subscribe({
        next: () => {
          this.isLoading = this.utilsService.setLoading(false);
          this.successMessage = "Customer assigned successfully.";
        },
        error: (err: any) => {
          this.isLoading = this.utilsService.setLoading(false);
          this.errorMessage = this.utilsService.setErrorMessage(
            "Customer assigning is failed",
            err.error.message,
          );
        },
      });
  }
}
