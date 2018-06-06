import { Buffer } from 'buffer';

export class FileUploadTransaction {
    uploadedDate: string;
    citizen: string;

    // block chain attributes
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    from: string; // address of the sender
    to: string; // address of the receiver
    cumulativeGasUsed: number;
    gasUsed: number;
    contractAddress: string; // The contract address created
    status: string; // '0x0' indicates transaction failure , '0x1' indicates transaction succeeded.
}
