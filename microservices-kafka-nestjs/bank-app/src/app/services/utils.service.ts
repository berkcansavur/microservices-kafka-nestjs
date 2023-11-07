import { Injectable } from "@angular/core";
import { TokenStorageService } from "./token-storage.service";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  constructor(private readonly tokenStorage: TokenStorageService) {}
  //Setters
  setErrorMessage(errorMessage: string, serverError?: any): string {
    if (serverError) {
      return errorMessage + ": " + serverError;
    } else {
      return errorMessage;
    }
  }
  setLoading(state: boolean): boolean {
    return state;
  }
  setProcess(process: string): string {
    return process;
  }
  //Conditions
  isUserCustomer(): boolean {
    const userType = this.tokenStorage.getUserType();
    if (userType?.toString() === "CUSTOMER") {
      return true;
    }
    return false;
  }
  isUserEmployee(): boolean {
    const userType = this.tokenStorage.getUserType();
    if (
      userType?.toString() === "CUSTOMER_REPRESENTATIVE" ||
      userType?.toString() === "BANK_DIRECTOR" ||
      userType?.toString() === "BANK_DEPARTMENT_DIRECTOR"
    ) {
      return true;
    }
    return false;
  }
  isUserAdmin(): boolean {
    const userType = this.tokenStorage.getUserType();
    if (userType?.toString() === "ADMIN") {
      return true;
    }
    return false;
  }
  reloadPage(): void {
    window.location.reload();
  }
  checkUserType(): string | null {
    return this.tokenStorage.getUserType();
  }
}
