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
  BankDepartmentDirector,
  BankDirector,
  PrivateCustomer,
} from "src/schemas/employee-schema";
import { AccountDTO, PrivateAccountDTO } from "src/dtos/bank.dto";
import { UserProfileDTO } from "src/dtos/auth.dto";
import { Types } from "mongoose";

@Injectable()
export class BankProfile extends AutomapperProfile {
  constructor(@InjectMapper() protected readonly mapper: Mapper) {
    super(mapper);
  }
  private customBankToString(bank: Types.ObjectId | undefined): string | null {
    console.log("Bank", bank);
    if (bank !== undefined) {
      return bank.toString();
    } else {
      return null;
    }
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
          (destination) => destination._id,
          mapFrom((source) => source._id.toString()),
        ),
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
          (destination) => destination.actionLogs,
          mapFrom((source) => source.actionLogs),
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
      createMap<Customer, UserProfileDTO>(
        mapper,
        Customer,
        UserProfileDTO,
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.userName,
          mapFrom((source) => source.customerName),
        ),
        forMember(
          (destination) => destination.userSurname,
          mapFrom((source) => source.customerSurname),
        ),
        forMember(
          (destination) => destination.userAge,
          mapFrom((source) => source.customerAge),
        ),
        forMember(
          (destination) => destination.userEmail,
          mapFrom((source) => source.email),
        ),
        forMember(
          (destination) => destination.bank,
          mapFrom((source) => {
            return this.customBankToString(source.bank);
          }),
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
          (destination) => destination.customerRepresentative,
          mapFrom((source) => source.customerRepresentative ?? null),
        ),
        forMember(
          (destination) => destination.userActions,
          mapFrom((source) => source.customerActions),
        ),
        forMember(
          (destination) => destination.userFullName,
          mapFrom(
            (source) => `${source.customerName} ${source.customerSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => source.createdAt),
        ),
        forMember(
          (destination) => destination.updatedAt,
          mapFrom((source) => source.updatedAt ?? null),
        ),
      );
      createMap<BankDirector, UserProfileDTO>(
        mapper,
        BankDirector,
        UserProfileDTO,
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.userName,
          mapFrom((source) => source.directorName),
        ),
        forMember(
          (destination) => destination.userSurname,
          mapFrom((source) => source.directorSurname),
        ),
        forMember(
          (destination) => destination.userAge,
          mapFrom((source) => source.directorAge),
        ),
        forMember(
          (destination) => destination.userEmail,
          mapFrom((source) => source.email),
        ),
        forMember(
          (destination) => destination.bank,
          mapFrom((source) => this.customBankToString(source.bank)),
        ),
        forMember(
          (destination) => destination.userActions,
          mapFrom((source) => source.actionLogs),
        ),
        forMember(
          (destination) => destination.userFullName,
          mapFrom(
            (source) => `${source.directorName} ${source.directorSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.transactions,
          mapFrom((source) => source.transactions),
        ),
      );
      createMap<BankDepartmentDirector, UserProfileDTO>(
        mapper,
        BankDepartmentDirector,
        UserProfileDTO,
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.userName,
          mapFrom((source) => source.departmentDirectorName),
        ),
        forMember(
          (destination) => destination.userSurname,
          mapFrom((source) => source.departmentDirectorSurname),
        ),
        forMember(
          (destination) => destination.userAge,
          mapFrom((source) => source.departmentDirectorAge),
        ),
        forMember(
          (destination) => destination.userEmail,
          mapFrom((source) => source.email),
        ),
        forMember(
          (destination) => destination.bank,
          mapFrom((source) => this.customBankToString(source.bank)),
        ),
        forMember(
          (destination) => destination.userActions,
          mapFrom((source) => source.actionLogs),
        ),
        forMember(
          (destination) => destination.userFullName,
          mapFrom(
            (source) =>
              `${source.departmentDirectorName} ${source.departmentDirectorSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.department,
          mapFrom((source) => source.department),
        ),
        forMember(
          (destination) => destination.transactions,
          mapFrom((source) => source.transactions),
        ),
      );
      createMap<BankCustomerRepresentative, UserProfileDTO>(
        mapper,
        BankCustomerRepresentative,
        UserProfileDTO,
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.userName,
          mapFrom((source) => source.customerRepresentativeName),
        ),
        forMember(
          (destination) => destination.userSurname,
          mapFrom((source) => source.customerRepresentativeSurname),
        ),
        forMember(
          (destination) => destination.userAge,
          mapFrom((source) => source.customerRepresentativeAge),
        ),
        forMember(
          (destination) => destination.userEmail,
          mapFrom((source) => source.email),
        ),
        forMember(
          (destination) => destination.bank,
          mapFrom((source) => this.customBankToString(source.bank)),
        ),
        forMember(
          (destination) => destination.userActions,
          mapFrom((source) => source.actionLogs),
        ),
        forMember(
          (destination) => destination.userFullName,
          mapFrom(
            (source) =>
              `${source.customerRepresentativeName} ${source.customerRepresentativeSurname}`,
          ),
        ),
        forMember(
          (destination) => destination.transactions,
          mapFrom((source) => source.transactions),
        ),
        forMember(
          (destination) => destination.customers,
          mapFrom((source) => source.customers),
        ),
      );
    };
  }
}
