import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import {
  CreateAccountDTO,
  CreateBankDTO,
  CreateCustomerDTO,
  CreateCustomerRepresentativeDTO,
  CreateDepartmentDirectorDTO,
  CreateDirectorDTO,
  CreateTransferDTO,
  IncomingTransferRequestDTO,
  MoneyTransferDTO,
} from "./dtos/api.dtos";

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject("BANK_SERVICE") private readonly bankClient: ClientKafka,
  ) {}
  async onModuleInit() {
    try {
      this.bankClient.subscribeToResponseOf(
        "create-transfer-across-accounts-event",
      );
      this.logger.debug(
        "create-transfer-across-accounts-event topic is subscribed",
      );
      this.bankClient.subscribeToResponseOf("approve-transfer-event");
      this.logger.debug("approve-transfer-event topic is subscribed");
      this.bankClient.subscribeToResponseOf("create-account-event");
      this.logger.debug("create-account-event topic is subscribed");
      this.bankClient.subscribeToResponseOf("transfer-money-to-account-event");
      this.logger.debug("transfer-money-to-account-event topic is subscribed");
      this.bankClient.subscribeToResponseOf("create-bank-event");
      this.logger.debug("create-bank-event topic is subscribed");
      this.bankClient.subscribeToResponseOf("create-bank-director-event");
      this.logger.debug("create-bank-director-event topic is subscribed");
      this.bankClient.subscribeToResponseOf(
        "create-bank-department-director-event",
      );
      this.logger.debug(
        "create-bank-department-director-event topic is subscribed",
      );
      this.bankClient.subscribeToResponseOf(
        "create-bank-customer-representative-event",
      );
      this.logger.debug(
        "create-bank-customer-representative-event topic is subscribed",
      );
      this.bankClient.subscribeToResponseOf("create-customer-event");
      this.logger.debug("create-customer-event topic is subscribed.");
      this.logger.debug(
        "Subscription of responses is successfully established.",
      );
    } catch (error) {
      this.logger.error("Subscription of responses is failed", error);
    }
  }
  sendCreateMoneyTransferRequest(createTransferRequestDTO: CreateTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createMoneyTransferRequest: ${JSON.stringify(
        createTransferRequestDTO,
      )}`,
    );
    return this.bankClient.send("create-transfer-across-accounts-event", {
      createTransferRequestDTO,
    });
  }
  sendApproveTransferRequest(approveTransferDTO: IncomingTransferRequestDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] approveTransfer: ${JSON.stringify(approveTransferDTO)}`,
    );
    return this.bankClient.send("approve-transfer-event", {
      approveTransferDTO,
    });
  }
  sendCreateAccountRequest(createAccountRequestDTO: CreateAccountDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createAccountRequest: ${JSON.stringify(
        createAccountRequestDTO,
      )}`,
    );
    return this.bankClient.send("create-account-event", {
      createAccountRequestDTO,
    });
  }
  sendTransferMoneyToAccountRequest(
    transferMoneyToAccountDTO: MoneyTransferDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[AppService] transferMoneyToAccountRequest: ${JSON.stringify(
        transferMoneyToAccountDTO,
      )}`,
    );
    return this.bankClient.send("transfer-money-to-account-event", {
      transferMoneyToAccountDTO,
    });
  }
  sendCreateCustomerRequest(createCustomerRequestDTO: CreateCustomerDTO) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateCustomerRequest DTO: ",
      createCustomerRequestDTO,
    );
    return this.bankClient.send(
      "create-customer-event",
      createCustomerRequestDTO,
    );
  }
  sendCreateBankRequest(createBankRequestDTO: CreateBankDTO) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateBankRequest DTO: ",
      createBankRequestDTO,
    );
    return this.bankClient.send("create-bank-event", createBankRequestDTO);
  }
  sendCreateDirectorRequest(createBankDirectorRequestDTO: CreateDirectorDTO) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest DTO: ",
      createBankDirectorRequestDTO,
    );
    return this.bankClient.send(
      "create-bank-director-event",
      createBankDirectorRequestDTO,
    );
  }
  sendCreateCustomerRepresentativeRequest(
    createCustomerRepresentativeRequestDTO: CreateCustomerRepresentativeDTO,
  ) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateCustomerRepresentativeRequest DTO: ",
      createCustomerRepresentativeRequestDTO,
    );
    return this.bankClient.send(
      "create-bank-customer-representative-event",
      createCustomerRepresentativeRequestDTO,
    );
  }
  sendCreateDepartmentDirectorRequest(
    createDepartmentDirectorRequestDTO: CreateDepartmentDirectorDTO,
  ) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest DTO: ",
      createDepartmentDirectorRequestDTO,
    );
    return this.bankClient.send(
      "create-bank-department-director-event",
      createDepartmentDirectorRequestDTO,
    );
  }
}
