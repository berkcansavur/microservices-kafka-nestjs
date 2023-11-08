import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { ProfileComponent } from "./pages/board-customer/profile/profile.component";
import { BoardEmployeeComponent } from "./pages/board-employee/board-employee.component";
import { RegisterComponent } from "./pages/board-customer/register/register.component";
import { TransfersComponent } from "./pages/transfers/transfers.component";
import { TransactionsComponent } from "./pages/board-employee/transactions/transactions.component";
import { DashboardComponent } from "./pages/board-customer/dashboard/dashboard.component";
import { AccountsComponent } from "./pages/accounts/accounts.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
  },
  {
    path: "employee",
    component: BoardEmployeeComponent,
  },
  {
    path: "transfers",
    component: TransfersComponent,
  },
  {
    path: "accounts",
    component: AccountsComponent,
  },
  {
    path: "transactions",
    component: TransactionsComponent,
  },
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
