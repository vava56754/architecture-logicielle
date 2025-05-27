export interface ITransferDataRoverConsole {
  transferRoverData(data: any): Promise<boolean>;
  transferConsoleData(data: any): Promise<boolean>;
  getTransferRate(): number;
  getDataSize(data: any): number;
  compressData(data: any): any;
  decompressData(data: any): any;
}
