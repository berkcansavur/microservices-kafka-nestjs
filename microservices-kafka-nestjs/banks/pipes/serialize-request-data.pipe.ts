import { Injectable, Logger, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIncomingRequest implements PipeTransform {
  private readonly logger = new Logger(ParseIncomingRequest.name);
  transform(value: any) {
    if (value && value.createTransferRequestDTO) {
      const formattedData = value.createTransferRequestDTO;
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
    if (value && value.transferApprovalDTO) {
      const formattedData = value.transferApprovalDTO;
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
    if (value && value.transferMoneyToAccountDTO) {
      const formattedData = value.transferMoneyToAccountDTO;
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
    if (value && value.approveTransferDTO) {
      const formattedData = value.approveTransferDTO;
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
    if (value && value.createAccountRequestDTO) {
      const formattedData = value.createAccountRequestDTO;
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
    if (value) {
      return value;
    }
  }
}
