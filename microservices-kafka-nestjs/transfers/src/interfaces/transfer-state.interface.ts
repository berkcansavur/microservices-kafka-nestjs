export interface ITransferState {
  create(createTransferRequestDTO: any): Promise<any>;
  approve(transferId: string): Promise<any>;
  cancel(transferId: string): Promise<any>;
}
