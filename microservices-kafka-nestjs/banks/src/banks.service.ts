import { Injectable, Logger } from '@nestjs/common';
import { IncomingTransferDTO, TransferDTO } from 'src/dtos/bank.dto';
import { BanksRepository } from './repositories/banks.repository';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class BanksService {
  private readonly logger = new Logger(BanksService.name);
  constructor(
    private readonly banksRepository: BanksRepository,
    @InjectMapper() private readonly BankMapper: Mapper,
  ) {}

  async approveMoneyTransfer({
    transferDTO,
  }: {
    transferDTO: IncomingTransferDTO;
  }): Promise<any> {
    console.log('approveMoneyTransfer DTO: ', transferDTO);
    //const { status, currencyType, amount, userId, fromAccount, toAccount } = approveTransferDTO;
    // Burada kafka service üzerinden accounts service ile ilteişime geçilece
    // ardından o servisteki işlem başarısına göre tekrardan transfer service'e işlemin başarı durumuna göre
    // transfer status bilgisi gönderilecek bu bilgi ile transfer service transferin status'ünü approved ya da
    // cancelled olarak güncelleyecek şimdilik örnek bir değişken oluşturacağım
    const moneyTransferResultFromAccounts = {
      message: 'success',
    };

    const mockTransfer = {
      id: '6519fe2013b8c9f269d615c7',
      currencyType: 'USD',
      status: '200',
      userId: '6519fe2013b8c9f269d615c6',
      fromAccount: 'Berkcan Denizbank',
      toAccount: 'Berkcan İş Bankası',
      amount: '1500',
    };

    if (moneyTransferResultFromAccounts.message === 'success') {
    }
    if (moneyTransferResultFromAccounts.message === 'rejected') {
    }
    return mockTransfer;
  }
}
