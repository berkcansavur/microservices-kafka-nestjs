import { Controller, Inject, OnModuleInit, UsePipes } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { ParseIncomingRequest } from 'pipes/serialize-transfer-data.pipe';

@Controller('/transfers')
export class TransfersController implements OnModuleInit {
  constructor(
    private readonly transfersService: TransfersService,
    @Inject('BANK_SERVICE') private readonly bankClient: ClientKafka,
  ) {}

  @EventPattern('create-transfer-event')
  @UsePipes(new ParseIncomingRequest())
  async createTransfer(data: any) {
    const { transfersService } = this;
    console.log('create transfer controller : ', data.createTransferRequestDTO);
    return await transfersService.createTransfer({
      createTransferRequestDTO: data.createTransferRequestDTO,
    });
  }

  @EventPattern('approve-transfer-event')
  handleTransferApproval(data: any) {
    console.log('handle transfer approval : ', data);
    this.transfersService.approveTransfer(data);
  }
  onModuleInit() {
    this.bankClient.subscribeToResponseOf('transfer_approval');
  }
}
