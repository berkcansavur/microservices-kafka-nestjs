import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { AccountDTO } from "src/dtos/account.dtos";
import { Account } from "src/schemas/account.schema";

@Injectable()
export class AccountProfile extends AutomapperProfile {
  constructor(@InjectMapper() protected readonly mapper: Mapper) {
    super(mapper);
  }
  get profile(): MappingProfile {
    return (mapper: Mapper) => {
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
    };
  }
}
