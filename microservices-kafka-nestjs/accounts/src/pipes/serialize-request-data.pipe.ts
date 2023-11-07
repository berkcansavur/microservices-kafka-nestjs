import { Injectable, Logger, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIncomingRequest implements PipeTransform {
  private readonly logger = new Logger(ParseIncomingRequest.name);
  transform(value: any) {
    if (value && value.createAccountDTOWithAccountNumber) {
      const formattedData = value.createAccountDTOWithAccountNumber;
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
    if (value && value.transferDTO) {
      const formattedData = value.transferDTO;
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
    if (value && value.createTransfer) {
      const formattedData = value.createTransfer;
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
    if (value && value.data) {
      const formattedData = value.data;
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
    if (value && value.getAccountsLastActionsDTO) {
      const formattedData = value.getAccountsLastActionsDTO;
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted getAccountsLastActionsDTO request data :",
        formattedData,
      );
      return formattedData;
    }
    if (value) {
      return value;
    }
  }
}
