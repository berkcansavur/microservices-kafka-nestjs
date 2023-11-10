import {
  IsEmail,
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
import { Expose, Exclude } from "class-transformer";
import { USER_TYPES } from "src/constants/banks.constants";

export class LoginUserDTO {
  @IsString()
  @IsEmpty()
  userType: USER_TYPES;

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
  access_token?: string;

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
export class UserProfileDTO {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  userSurname: string;

  @IsNotEmpty()
  @IsString()
  userFullName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  userEmail: string;

  @IsNotEmpty()
  @IsNumber()
  customerNumber?: number;

  @IsNotEmpty()
  @IsNumber()
  customerSocialSecurityNumber?: number;

  customerRepresentative?: object | null;

  @IsNotEmpty()
  @IsNumber()
  userAge: number;

  accounts?: object[];
  customers?: object[];
  userActions?: object[];
  transactions?: object[];

  @IsString()
  bank?: string | null;

  @IsString()
  department?: string;

  createdAt?: Date;

  updatedAt?: Date;
}
export class CustomerIdDTO {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;
}
