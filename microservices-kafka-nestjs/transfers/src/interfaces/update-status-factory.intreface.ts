import { TRANSFER_STATUSES } from "src/constants/transfer.constants";
import { IUpdateStatus } from "./update-status.interface";

export interface IUpdateStatusFactory {
  updateStatus(status: TRANSFER_STATUSES): Promise<IUpdateStatus>;
}
