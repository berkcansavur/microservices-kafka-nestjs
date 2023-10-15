import {
  EVENT_RESULTS,
  TRANSFER_STATUSES,
} from "../constants/transfer.constants";

export class TransferLogic {
  static checkTransferStatus(
    transfersStatus: TRANSFER_STATUSES,
    expectedStatuses: TRANSFER_STATUSES[],
  ): boolean {
    if (expectedStatuses.includes(transfersStatus)) {
      return true;
    }
    return false;
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
