import { Component, Input } from "@angular/core";

@Component({
  selector: "[app-app-error]",
  templateUrl: "./app-error.component.html",
})
export class AppErrorComponent {
  @Input() errorMessage: string | undefined;
  @Input() process: string | undefined;
  show: boolean = true;
  constructor() {}
  reloadPage(): void {
    window.location.reload();
  }
}
