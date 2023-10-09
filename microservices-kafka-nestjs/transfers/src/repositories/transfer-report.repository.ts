import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TransferReport,
  TransferReportDocument,
} from '../schemas/transfer-report.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransferReportRepository {
  constructor(
    @InjectModel(TransferReport.name)
    private TransferReportModel: Model<TransferReportDocument>,
  ) {}

  async createTransferReport({
    transferReport,
  }: {
    transferReport: TransferReport;
  }): Promise<TransferReportDocument> {
    const { TransferReportModel } = this;
    return (await TransferReportModel.create({ ...transferReport })).toObject();
  }
  async getTransferReport({
    transferReportId,
  }: {
    transferReportId: string;
  }): Promise<TransferReport | null> {
    const { TransferReportModel } = this;

    return TransferReportModel.findOne<TransferReport>({
      _id: transferReportId,
    })
      .lean()
      .exec();
  }
  async getTransferReportByDeliveryId({
    transferId,
  }: {
    transferId: string;
  }): Promise<TransferReport | null> {
    const { TransferReportModel } = this;

    return TransferReportModel.findOne<TransferReport>({ transfer: transferId })
      .lean()
      .exec();
  }
}
