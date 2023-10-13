import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import {
  AccountDTO,
  CreateAccountDTO,
  CreateAccountIncomingRequestDTO,
  CreateMoneyTransferDTO,
  IncomingCreateMoneyTransferDTO,
  TransferDTO,
} from "src/dtos/account.dtos";
import { Account } from "src/schemas/account.schema";

@Injectable()
export class AccountProfile extends AutomapperProfile {
  constructor(@InjectMapper() protected readonly mapper: Mapper) {
    super(mapper);
  }
  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IncomingCreateMoneyTransferDTO, TransferDTO>(
        mapper,
        IncomingCreateMoneyTransferDTO,
        TransferDTO,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source.userId),
        ),
        forMember(
          (destination) => destination.toAccount,
          mapFrom((source) => source.toAccountId),
        ),
        forMember(
          (destination) => destination.fromAccount,
          mapFrom((source) => source.fromAccountId),
        ),
        forMember(
          (destination) => destination.currencyType,
          mapFrom((source) => source.currencyType),
        ),
        forMember(
          (destination) => destination.amount,
          mapFrom((source) => source.amount),
        ),
      );
      createMap<TransferDTO, CreateMoneyTransferDTO>(
        mapper,
        TransferDTO,
        CreateMoneyTransferDTO,
        forMember(
          (destination) => destination.transferId,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source.userId),
        ),
        forMember(
          (destination) => destination.toAccountId,
          mapFrom((source) => source.toAccount),
        ),
        forMember(
          (destination) => destination.fromAccountId,
          mapFrom((source) => source.fromAccount),
        ),
        forMember(
          (destination) => destination.currencyType,
          mapFrom((source) => source.currencyType),
        ),
        forMember(
          (destination) => destination.amount,
          mapFrom((source) => source.amount),
        ),
      );
      createMap<IncomingCreateMoneyTransferDTO, CreateMoneyTransferDTO>(
        mapper,
        IncomingCreateMoneyTransferDTO,
        CreateMoneyTransferDTO,
        forMember(
          (destination) => destination.transferId,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source.userId),
        ),
        forMember(
          (destination) => destination.toAccountId,
          mapFrom((source) => source.toAccountId),
        ),
        forMember(
          (destination) => destination.fromAccountId,
          mapFrom((source) => source.fromAccountId),
        ),
        forMember(
          (destination) => destination.currencyType,
          mapFrom((source) => source.currencyType),
        ),
        forMember(
          (destination) => destination.amount,
          mapFrom((source) => source.amount),
        ),
      );
      createMap<Account, AccountDTO>(
        mapper,
        Account,
        AccountDTO,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.accountNumber,
          mapFrom((source) => source.accountNumber),
        ),
        forMember(
          (destination) => destination.accountName,
          mapFrom((source) => source.accountName),
        ),
        forMember(
          (destination) => destination.actionLogs,
          mapFrom((source) => source.actionLogs),
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
          (destination) => destination.userId,
          mapFrom((source) => source.userId),
        ),
      );
      createMap<CreateAccountIncomingRequestDTO, CreateAccountDTO>(
        mapper,
        CreateAccountIncomingRequestDTO,
        CreateAccountDTO,
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source.userId),
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
          (destination) => destination.interest,
          mapFrom((source) => source.interest),
        ),
      );
    };
  }
}
