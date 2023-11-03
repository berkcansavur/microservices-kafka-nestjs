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
import { CustomerDTO, EmployeeDTO } from "src/dtos/bank.dto";

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
      createMap<BankDirector, EmployeeDTO>(
        mapper,
        BankDirector,
        EmployeeDTO,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.email,
          mapFrom((source) => source.email),
        ),
        forMember(
          (destination) => destination.employeeFullName,
          mapFrom(
            (source) => `${source.directorName}  ${source.directorSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.employeeAge,
          mapFrom((source) => source.directorAge),
        ),
        forMember(
          (destination) => destination.bank,
          mapFrom((source) => source.bank),
        ),
        forMember(
          (destination) => destination.actionLogs,
          mapFrom((source) => source.actionLogs),
        ),
        forMember(
          (destination) => destination.transactions,
          mapFrom((source) => source.transactions),
        ),
        forMember(
          (destination) => destination.accessToken,
          mapFrom((source) => source.accessToken),
        ),
      );
      createMap<BankDepartmentDirector, EmployeeDTO>(
        mapper,
        BankDepartmentDirector,
        EmployeeDTO,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.email,
          mapFrom((source) => source.email),
        ),
        forMember(
          (destination) => destination.employeeFullName,
          mapFrom(
            (source) =>
              `${source.departmentDirectorName}  ${source.departmentDirectorSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.employeeAge,
          mapFrom((source) => source.departmentDirectorAge),
        ),
        forMember(
          (destination) => destination.bank,
          mapFrom((source) => source.bank),
        ),
        forMember(
          (destination) => destination.actionLogs,
          mapFrom((source) => source.actionLogs),
        ),
        forMember(
          (destination) => destination.transactions,
          mapFrom((source) => source.transactions),
        ),
        forMember(
          (destination) => destination.accessToken,
          mapFrom((source) => source.accessToken),
        ),
      );
      createMap<BankCustomerRepresentative, EmployeeDTO>(
        mapper,
        BankCustomerRepresentative,
        EmployeeDTO,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.email,
          mapFrom((source) => source.email),
        ),
        forMember(
          (destination) => destination.employeeFullName,
          mapFrom(
            (source) =>
              `${source.customerRepresentativeName}  ${source.customerRepresentativeSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.employeeAge,
          mapFrom((source) => source.customerRepresentativeAge),
        ),
        forMember(
          (destination) => destination.bank,
          mapFrom((source) => source.bank),
        ),
        forMember(
          (destination) => destination.actionLogs,
          mapFrom((source) => source.actionLogs),
        ),
        forMember(
          (destination) => destination.transactions,
          mapFrom((source) => source.transactions),
        ),
        forMember(
          (destination) => destination.accessToken,
          mapFrom((source) => source.accessToken),
        ),
      );
      createMap<Customer, CustomerDTO>(
        mapper,
        Customer,
        CustomerDTO,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.email,
          mapFrom((source) => source.email),
        ),
        forMember(
          (destination) => destination.customerNumber,
          mapFrom((source) => source.customerNumber),
        ),
        forMember(
          (destination) => destination.customerSocialSecurityNumber,
          mapFrom((source) => source.customerSocialSecurityNumber),
        ),
        forMember(
          (destination) => destination.customerFullName,
          mapFrom(
            (source) => `${source.customerName}  ${source.customerSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.customerAge,
          mapFrom((source) => source.customerAge),
        ),
        forMember(
          (destination) => destination.bank,
          mapFrom((source) => source.bank),
        ),
        forMember(
          (destination) => destination.customerRepresentative,
          mapFrom((source) => source.customerRepresentative),
        ),
        forMember(
          (destination) => destination.accounts,
          mapFrom((source) => source.accounts),
        ),
        forMember(
          (destination) => destination.customerActions,
          mapFrom((source) => source.customerActions),
        ),
        forMember(
          (destination) => destination.accessToken,
          mapFrom((source) => source.accessToken),
        ),
      );
    };
  }
}
