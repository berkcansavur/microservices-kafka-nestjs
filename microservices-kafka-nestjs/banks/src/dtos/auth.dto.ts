import { IsEmail, IsEmpty, IsString } from "class-validator";
import { Expose, Exclude } from "class-transformer";
import { USER_TYPES } from "src/constants/banks.constants";
import { EMPLOYEE_TYPES } from "src/types/employee.types";

export class LoginUserDTO {
  @IsString()
  @IsEmpty()
  userType: USER_TYPES | EMPLOYEE_TYPES;

  @IsEmail()
  @IsEmpty({ message: "Email is required" })
  email: string;

  @IsString()
  @IsEmpty()
  password: string;
}
export class CurrentUserDTO {
  @Expose()
  userId: string;
  @Expose()
  userName: string;
  @Expose()
  userEmail: string;
}
export class AuthenticatedUserDTO {
  @Exclude()
  @IsEmpty({
    message: "Users must be authenticated, authentication is required !",
  })
  access_token: string;

  @Expose()
  @IsEmpty()
  userId: string;

  @Expose()
  @IsEmpty()
  userEmail: string;

  @Expose()
  @IsEmpty()
  userName: string;
}
