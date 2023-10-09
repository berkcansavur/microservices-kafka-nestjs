import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransferDTO, IncomingTransferDTO } from './dtos/api.dtos';

@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSFER_SERVICE') private readonly transferClient: ClientKafka,
  ) {}
  async createMoneyTransferRequest(
    createTransferRequestDTO: CreateTransferDTO,
  ) {
    console.log('createMoneyTransferRequest DTO : ', createTransferRequestDTO);
    this.transferClient.emit('create-transfer-event', {
      createTransferRequestDTO,
    });
  }
  approveTransfer(approveTransferDTO: IncomingTransferDTO) {
    console.log('approveTransfer DTO :', approveTransferDTO);
    this.transferClient.emit('approve-transfer-event', {
      approveTransferDTO,
    });
  }
}
