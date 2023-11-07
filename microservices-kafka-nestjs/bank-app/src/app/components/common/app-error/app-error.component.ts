import { Component, Input, OnInit } from "@angular/core";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "[app-app-error]",
  templateUrl: "./app-error.component.html",
})
export class AppErrorComponent implements OnInit {
  @Input() errorMessage: string | undefined;
  @Input() process: string | undefined;
  show: boolean = true;
  isErrorAuthentication: boolean = false;
  customError: string = "";
  constructor(private readonly tokenStorage: TokenStorageService) {}
  ngOnInit(): void {
    this.setErrorProcess();
    this.checkErrorType();
  }
  setErrorProcess() {
    const [customProcess] = this.process?.split(".") ?? [];
    this.process = `"${customProcess}"`;
  }
  checkErrorType() {
    const [, errorType] = this.errorMessage?.split(": ") ?? [];
    console.log(this.errorMessage);
    if (errorType === "Unauthorized") {
      this.tokenStorage.setIsLoggedIn("false");
      const [customProcess] = this.process?.split(".") ?? [];
      this.isErrorAuthentication = !this.isErrorAuthentication;
      this.show = false;
      this.customError = `You must login again to perform "${customProcess}" operation.`;
    }
  }
  reloadPage(): void {
    window.location.reload();
  }
}
