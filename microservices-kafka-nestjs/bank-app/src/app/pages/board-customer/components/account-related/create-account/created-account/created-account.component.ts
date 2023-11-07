import { Component, Input } from "@angular/core";
import { IAccountItem } from "src/app/models/accounts.model";

@Component({
  selector: "[app-created-account]",
  templateUrl: "./created-account.component.html",
})
export class CreatedAccountComponent {
  @Input() returnedCreatedAccount: IAccountItem | undefined;
  reloadPage(): void {
    window.location.reload();
  }
}
