import { Inject, Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { TRANSFER_STATUSES } from "src/constants/transfer.constants";
import { TransferStatusIsNotValidException } from "src/exceptions";
import { ITransferStateFactory } from "src/interfaces/transfer-state-factory.interface";
import { ITransferState } from "src/interfaces/transfer-state.interface";

@Injectable()
export class TransferStateFactory implements ITransferStateFactory {
  constructor(
    private readonly moduleReference: ModuleRef,
    @Inject("TRANSFER_STATE")
    private readonly transferStateMap: Record<
      TRANSFER_STATUSES,
      Type<ITransferState>
    >,
  ) {}
  async getTransferState(state: TRANSFER_STATUSES): Promise<ITransferState> {
    const { transferStateMap } = this;
    const TransferStateClass = transferStateMap[state];
    if (!TransferStateClass) {
      throw new TransferStatusIsNotValidException({ message: state });
    }
    return this.moduleReference.create<ITransferState>(TransferStateClass);
  }
}
