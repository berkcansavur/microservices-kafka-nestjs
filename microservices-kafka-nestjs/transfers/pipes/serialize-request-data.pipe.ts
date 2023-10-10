import { Injectable, Logger, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIncomingRequest implements PipeTransform {
  private readonly logger = new Logger(ParseIncomingRequest.name);
  transform(value: any) {
    if (value && value.createTransferRequestDTO) {
      const formattedData = {
        createTransferRequestDTO: {
          currencyType: value.createTransferRequestDTO.currencyType,
          userId: value.createTransferRequestDTO.userId,
          fromAccount: value.createTransferRequestDTO.fromAccount,
          toAccount: value.createTransferRequestDTO.toAccount,
          amount: value.createTransferRequestDTO.amount,
        },
      };
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
  }
}
