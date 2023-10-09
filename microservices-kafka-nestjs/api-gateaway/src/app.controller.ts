import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApproveTransferRequestDTO, CreateTransferDTO } from './dtos/api.dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/createTransfer')
  createTransfer(@Body() createTransferRequestDTO: CreateTransferDTO) {
    const { appService } = this;
    appService.createMoneyTransferRequest(createTransferRequestDTO);
  }

  @Post('/approveTransfer')
  approveTransfer(
    @Body() approveTransferRequestDTO: ApproveTransferRequestDTO,
  ) {
    const { appService } = this;
    appService.approveTransfer(approveTransferRequestDTO);
  }
}
