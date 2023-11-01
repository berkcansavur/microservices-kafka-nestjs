import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import {
  Customer,
  PrivateCustomerRepresentative,
} from "src/schemas/customers.schema";
import {
  BankCustomerRepresentative,
  PrivateCustomer,
} from "src/schemas/employee-schema";
import { AccountDTO, PrivateAccountDTO } from "src/dtos/bank.dto";

@Injectable()
export class BankProfile extends AutomapperProfile {
  constructor(@InjectMapper() protected readonly mapper: Mapper) {
    super(mapper);
  }
  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<Customer, PrivateCustomer>(
        mapper,
        Customer,
        PrivateCustomer,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.customerName,
          mapFrom((source) => source.customerName),
        ),
        forMember(
          (destination) => destination.customerSurname,
          mapFrom((source) => source.customerSurname),
        ),
        forMember(
          (destination) => destination.customerAge,
          mapFrom((source) => source.customerAge),
        ),
        forMember(
          (destination) => destination.customerNumber,
          mapFrom((source) => source.customerNumber),
        ),
        forMember(
          (destination) => destination.accounts,
          mapFrom((source) => source.accounts),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => source.createdAt),
        ),
        forMember(
          (destination) => destination.updatedAt,
          mapFrom((source) => source.updatedAt),
        ),
      );
      createMap<AccountDTO, PrivateAccountDTO>(
        mapper,
        AccountDTO,
        PrivateAccountDTO,
        forMember(
          (destination) => destination.accountName,
          mapFrom((source) => source.accountName),
        ),
        forMember(
          (destination) => destination.accountNumber,
          mapFrom((source) => source.accountNumber),
        ),
        forMember(
          (destination) => destination.balance,
          mapFrom((source) => source.balance),
        ),
        forMember(
          (destination) => destination.interest,
          mapFrom((source) => source.interest),
        ),
        forMember(
          (destination) => destination.status,
          mapFrom((source) => source.status),
        ),
        forMember(
          (destination) => destination.accountType,
          mapFrom((source) => source.accountType),
        ),
      );
      createMap<BankCustomerRepresentative, PrivateCustomerRepresentative>(
        mapper,
        BankCustomerRepresentative,
        PrivateCustomerRepresentative,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.customerRepresentativeName,
          mapFrom((source) => source.customerRepresentativeName),
        ),
        forMember(
          (destination) => destination.customerRepresentativeSurname,
          mapFrom((source) => source.customerRepresentativeSurname),
        ),
      );
    };
  }
}
