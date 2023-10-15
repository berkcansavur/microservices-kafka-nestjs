import { Inject, Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { TRANSFER_STATUSES } from "src/constants/transfer.constants";
import { ITransferState } from "src/interfaces/transfer-state.interface";

@Injectable()
export class TransferStateFactory {
  constructor(
    private readonly moduleReference: ModuleRef,
    @Inject("TRANSFER_STATE")
    private readonly stateMap: Record<TRANSFER_STATUSES, Type<ITransferState>>,
  ) {}
  async getState(state: TRANSFER_STATUSES): Promise<ITransferState> {
    const { stateMap } = this;
    const StateClass = stateMap[state];
    if (StateClass) {
      return this.moduleReference.create<ITransferState>(StateClass);
    }
    throw new Error("Invalid State");
  }
}
