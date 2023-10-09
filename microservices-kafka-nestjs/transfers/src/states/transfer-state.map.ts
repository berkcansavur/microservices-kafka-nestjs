import { TRANSFER_STATUSES } from '../constants/transfer.constants';
import { TransferCreatedState } from './transfer-created.state';

export const TransferStateMap = {
  provide: 'TRANSFER_STATE',
  useValue: {
    [TRANSFER_STATUSES.CREATED]: TransferCreatedState,
  },
};
