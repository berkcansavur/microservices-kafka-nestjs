import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { BoardAdminComponent } from "./pages/board-admin/board-admin.component";
import { BoardCustomerComponent } from "./pages/board-customer/board-customer.component";
import { BoardEmployeeComponent } from "./pages/board-employee/board-employee.component";
import { RegisterComponent } from "./pages/register/register.component";

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
    path: "customer",
    component: BoardCustomerComponent,
  },
  {
    path: "admin",
    component: BoardAdminComponent,
  },
  {
    path: "employee",
    component: BoardEmployeeComponent,
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
