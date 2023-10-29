import { Converter } from "@automapper/core";
import { ReturnTransferDTO, TransferDTO } from "src/dtos/transfer.dto";

type ApprovedTransferEventConverterParams = TransferDTO & {
  userId: string;
};

export const ApprovedTransferEventConverter: Converter<
  ApprovedTransferEventConverterParams,
  ReturnTransferDTO
> = {
  convert: function (
    transfer: ApprovedTransferEventConverterParams | any,
  ): ReturnTransferDTO {
    return {
      id: transfer._id,
      currencyType: transfer.currencyType,
      status: transfer.status,
      userId: transfer.userId,
      fromAccount: transfer.fromAccount,
      toAccount: transfer.toAccount,
      amount: transfer.amount,
    };
  },
};
