export class ApproveTransferEvent {
  constructor(
    public readonly id: string,
    public readonly currencyType: string,
    public readonly status: string,
    public readonly userId: string,
    public readonly fromAccount: string,
    public readonly toAccount: string,
    public readonly amount: string,
  ) {}
}
