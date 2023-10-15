import { TRANSFER_STATUSES } from "../constants/transfer.constants";
import { TransferApprovePendingState } from "./transfer-approve-pending.state";
import { TransferApprovedState } from "./transfer-approved.state";
import { TransferCancelPendingState } from "./transfer-cancel-pending.state";
import { TransferCanceledState } from "./transfer-cancelled.state";
import { TransferCompletedState } from "./transfer-completed.state";
import { TransferCreatedState } from "./transfer-created.state";
import { TransferFailedState } from "./transfer-failed.state";
import { TransferStartedState } from "./transfer-started.state";

export const TransferStateMap = {
  provide: "TRANSFER_STATE",
  useValue: {
    [TRANSFER_STATUSES.CREATED]: TransferCreatedState,
    [TRANSFER_STATUSES.APPROVED]: TransferApprovedState,
    [TRANSFER_STATUSES.APPROVE_PENDING]: TransferApprovePendingState,
    [TRANSFER_STATUSES.TRANSFER_STARTED]: TransferStartedState,
    [TRANSFER_STATUSES.COMPLETED]: TransferCompletedState,
    [TRANSFER_STATUSES.CANCEL_PENDING]: TransferCancelPendingState,
    [TRANSFER_STATUSES.CANCELLED]: TransferCanceledState,
    [TRANSFER_STATUSES.FAILED]: TransferFailedState,
  },
};
