import {
  EVENT_RESULTS,
  TRANSFER_STATUSES,
} from '../constants/transfer.constants';
import { TransferType } from '../types/transfer.types';

export class TransferLogic {
  static isTransferStatus({
    transfer,
    statuses = [],
  }: {
    transfer: TransferType;
    statuses: TRANSFER_STATUSES[];
  }): boolean {
    return statuses.includes(transfer.status);
  }

  static isReturnOrderEventResultCode({
    resultCode,
    codes = [],
  }: {
    resultCode: EVENT_RESULTS;
    codes: EVENT_RESULTS[];
  }) {
    return codes.includes(resultCode);
  }
}
