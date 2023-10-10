import { Injectable, Logger, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIncomingRequest implements PipeTransform {
  private readonly logger = new Logger(ParseIncomingRequest.name);
  transform(value: any) {
    if (value && value.createAccountRequestDTO) {
      const formattedData = {
        createAccountRequestDTO: {},
      };
      this.logger.debug(
        "[ParseIncomingRequest Pipe] Formatted request data :",
        formattedData,
      );
      return formattedData;
    }
  }
}
