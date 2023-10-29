import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Customer } from "src/schemas/customers.schema";
import { PrivateCustomer } from "src/schemas/employee-schema";

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
    };
  }
}
