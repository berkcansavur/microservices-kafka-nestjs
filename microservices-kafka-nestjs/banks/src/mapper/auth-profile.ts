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
import {
  BankCustomerRepresentative,
  BankDepartmentDirector,
  BankDirector,
} from "src/schemas/employee-schema";
import { CurrentUserDTO } from "src/dtos/auth.dto";

@Injectable()
export class AuthProfile extends AutomapperProfile {
  constructor(@InjectMapper() protected readonly mapper: Mapper) {
    super(mapper);
  }
  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<Customer, CurrentUserDTO>(
        mapper,
        Customer,
        CurrentUserDTO,
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.userName,
          mapFrom(
            (source) => `${source.customerName}  ${source.customerSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.userEmail,
          mapFrom((source) => source.email),
        ),
      );
      createMap<BankDirector, CurrentUserDTO>(
        mapper,
        BankDirector,
        CurrentUserDTO,
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.userName,
          mapFrom(
            (source) => `${source.directorName}  ${source.directorSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.userEmail,
          mapFrom((source) => source.email),
        ),
      );
      createMap<BankCustomerRepresentative, CurrentUserDTO>(
        mapper,
        BankCustomerRepresentative,
        CurrentUserDTO,
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.userName,
          mapFrom(
            (source) =>
              `${source.customerRepresentativeName}  ${source.customerRepresentativeSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.userEmail,
          mapFrom((source) => source.email),
        ),
      );
      createMap<BankDepartmentDirector, CurrentUserDTO>(
        mapper,
        BankDepartmentDirector,
        CurrentUserDTO,
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.userName,
          mapFrom(
            (source) =>
              `${source.departmentDirectorName}  ${source.departmentDirectorSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.userEmail,
          mapFrom((source) => source.email),
        ),
      );
    };
  }
}
