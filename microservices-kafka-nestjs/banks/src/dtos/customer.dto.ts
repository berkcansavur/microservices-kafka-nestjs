import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class SearchTextDTO {
  @IsNotEmpty()
  @IsString()
  query: string;
}
export class AddAccountDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  accountId: string;
}
