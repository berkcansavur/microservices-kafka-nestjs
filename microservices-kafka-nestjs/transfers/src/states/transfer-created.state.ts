/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Scope } from '@nestjs/common';
import { ITransferState } from '../interfaces/transfer-state.interface';
import { CreateTransferRequestDTO, TransferDTO } from '../dtos/transfer.dto';

@Injectable({ scope: Scope.REQUEST })
export class TransferCreatedState implements ITransferState {
  create(
    createTransferRequestDTO: CreateTransferRequestDTO,
  ): Promise<TransferDTO> {
    throw new Error('Method not implemented. CREATE');
  }
  approve(transferId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  cancel(transferId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
