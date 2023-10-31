import { Controller, Logger } from "@nestjs/common";
import { CustomersService } from "src/services/customers.service";

@Controller("/customers")
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);
  constructor(private readonly customerService: CustomersService) {}
}
