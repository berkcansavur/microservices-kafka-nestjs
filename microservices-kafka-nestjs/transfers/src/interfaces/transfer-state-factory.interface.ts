import { ITransferState } from "./transfer-state.interface";
import { TRANSFER_STATUSES } from "../constants/transfer.constants";

export interface ITransferStateFactory {
  getTransferState(state: TRANSFER_STATUSES): Promise<ITransferState>;
}
