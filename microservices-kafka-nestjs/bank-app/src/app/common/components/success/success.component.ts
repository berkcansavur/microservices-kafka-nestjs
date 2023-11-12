import { Component, Input, OnInit } from "@angular/core";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "[app-success]",
  templateUrl: "./app-success.component.html",
})
export class SuccessComponent implements OnInit {
  @Input() successMessage: string | undefined;
  @Input() process: string | undefined;
  show: boolean = true;
  customSuccess: string = "";
  isSuccessCustome: boolean = false;
  constructor(private readonly tokenStorage: TokenStorageService) {}
  ngOnInit(): void {
    this.setSuccessProcess();
  }
  setSuccessProcess() {
    const [customProcess] = this.process?.split(".") ?? [];
    this.process = `"${customProcess}"`;
  }
  reloadPage(): void {
    window.location.reload();
  }
}
