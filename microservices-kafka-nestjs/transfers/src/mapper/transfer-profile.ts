import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { Transfer } from "../schemas/transfer.schema";
import {
  CreateTransferDTO,
  CreateTransferIncomingRequestDTO,
  CreateTransferRequestDTO,
  TransferDTO,
} from "../dtos/transfer.dto";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";

@Injectable()
export class TransferProfile extends AutomapperProfile {
  constructor(@InjectMapper() protected readonly mapper: Mapper) {
    super(mapper);
  }
  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<CreateTransferIncomingRequestDTO, CreateTransferDTO>(
        mapper,
        CreateTransferIncomingRequestDTO,
        CreateTransferDTO,
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source.userId),
        ),
        forMember(
          (destination) => destination.currencyType,
          mapFrom((source) => source.currencyType),
        ),
        forMember(
          (destination) => destination.fromAccount,
          mapFrom((source) => source.fromAccount),
        ),
        forMember(
          (destination) => destination.toAccount,
          mapFrom((source) => source.toAccount),
        ),
        forMember(
          (destination) => destination.amount,
          mapFrom((source) => source.amount),
        ),
      );
      createMap<any, CreateTransferRequestDTO>(
        mapper,
        CreateTransferDTO,
        CreateTransferRequestDTO,
        forMember(
          (destination) => destination.currencyType,
          mapFrom((source) => source.currencyType),
        ),
        forMember(
          (destination) => destination.amount,
          mapFrom((source) => source.amount),
        ),
        forMember(
          (destination) => destination.fromAccount,
          mapFrom((source) => source.fromAccount),
        ),
        forMember(
          (destination) => destination.toAccount,
          mapFrom((source) => source.toAccount),
        ),
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source.userId),
        ),
      ),
        createMap<Transfer, TransferDTO>(
          mapper,
          Transfer,
          TransferDTO,
          forMember(
            (destination) => destination._id,
            mapFrom((source) => source._id),
          ),
          forMember(
            (destination) => destination.userId,
            mapFrom((source) => source.userId.toString()),
          ),
          forMember(
            (destination) => destination.status,
            mapFrom((source) => source.status),
          ),
          forMember(
            (destination) => destination.currencyType,
            mapFrom((source) => source.currencyType),
          ),
          forMember(
            (destination) => destination.fromAccount,
            mapFrom((source) => source.fromAccount),
          ),
          forMember(
            (destination) => destination.toAccount,
            mapFrom((source) => source.toAccount),
          ),
          forMember(
            (destination) => destination.amount,
            mapFrom((source) => source.amount),
          ),
        );
    };
  }
}
