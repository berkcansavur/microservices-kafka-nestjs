import { Controller, Logger } from "@nestjs/common";

@Controller("/customers")
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);
}
