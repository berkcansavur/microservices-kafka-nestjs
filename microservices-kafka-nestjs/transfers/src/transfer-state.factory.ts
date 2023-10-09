import { Inject, Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { TRANSFER_STATUSES } from './constants/transfer.constants';
import { ITransferState } from './interfaces/transfer-state.interface';
import { ITransferStateFactory } from './interfaces/transfer-state-factory.interface';

@Injectable()
export class TransferStateFactory implements ITransferStateFactory {
  constructor(
    private moduleRef: ModuleRef,
    @Inject('TRANSFER_STATE')
    private readonly stateMap: Record<TRANSFER_STATUSES, Type<ITransferState>>,
  ) {}
  getState(state: TRANSFER_STATUSES): Promise<ITransferState> {
    const { stateMap } = this;
    const StateClass = stateMap[state];
    if (StateClass) {
      return this.moduleRef.create<ITransferState>(StateClass);
    }
    throw new Error('Invalid State');
  }
}
