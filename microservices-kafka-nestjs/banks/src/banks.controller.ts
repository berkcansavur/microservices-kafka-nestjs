import { Controller } from "@nestjs/common";
import { BanksService } from "./banks.service";
import { MessagePattern } from "@nestjs/microservices";

@Controller("banks")
export class BanksController {
  constructor(private readonly bankService: BanksService) {}

  @MessagePattern("transfer_approval")
  async approveTransfer(data: any) {
    console.log("Banks approveTransfer Incoming Data:", data);
    const transferApproval = await this.bankService.approveMoneyTransfer(data);
    return JSON.stringify(transferApproval);
  }
}
