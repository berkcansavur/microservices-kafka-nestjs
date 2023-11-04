import { Component } from "@angular/core";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "app-transfers",
  templateUrl: "./transfer.component.html",
})
export class TransfersComponent {
  constructor(private readonly tokenStorage: TokenStorageService) {}
}
