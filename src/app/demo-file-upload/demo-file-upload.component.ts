import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Buffer } from 'buffer';

import { FileUploadTransaction } from '../models/file-upload-transaction.model';

@Component({
  selector: 'app-demo-file-upload',
  templateUrl: './demo-file-upload.component.html',
  styleUrls: ['./demo-file-upload.component.css']
})
export class DemoFileUploadComponent implements OnInit {

  fileUploadTrx: FileUploadTransaction;

  trxDataList: FileUploadTransaction[] = [];

  selectedFile: File = null;
  uploadedPercentage = 0;
  showMessage = false;
  message: String = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.onLoadExistingTrxs();
  }

  onLoadExistingTrxs() {
    this.http.get('/ipfs/find-all').subscribe(
      (response) => {
        for (const index in response) {
          if (response.hasOwnProperty('data')) {
            const docs = response[index];
            console.log(docs);
            for (let i = 0; i < docs.length; i++) {
              const doc = docs[i];
              console.log(doc);
              this.fileUploadTrx = new FileUploadTransaction();
              this.fileUploadTrx.transactionHash = doc.trxHash;
              this.fileUploadTrx.ipfsHash = doc.ipfsHash;
              this.fileUploadTrx.from = doc.sender;
              this.fileUploadTrx.uploadedDate = doc.uploaded_date;
              this.fileUploadTrx.uploadedStatus = doc.upload_status;
              console.log(this.fileUploadTrx);
              this.trxDataList.push(this.fileUploadTrx);
            }
          }
        }
        console.log(this.trxDataList);
      },
      error => {
        console.log(error);
        this.showMessage = true;
      });
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload() {
    const fd = new FormData();
    this.showMessage = false;
    console.log(this.selectedFile.name);
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.http.post('/ipfs/upload-file', fd, {
      reportProgress: true, observe: 'events'
    }).subscribe(
      (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('File uploading started');
          break;
        case HttpEventType.Response:
          console.log('File uploading completed');
          this.message = 'Uploaded Successfully';
          this.showMessage = true;
          const data = event.body.data;
          console.log(data);
          this.fileUploadTrx = new FileUploadTransaction();
          this.fileUploadTrx.transactionHash = data.trxHash;
          this.fileUploadTrx.ipfsHash = data.ipfsHash;
          this.fileUploadTrx.from = data.sender;
          this.fileUploadTrx.uploadedDate = data.uploaded_date;
          this.fileUploadTrx.uploadedStatus = data.upload_status;
          this.trxDataList.push(this.fileUploadTrx);
          this.uploadedPercentage = 0;

          // this.fileUploadTrx = new FileUploadTransaction();
          // this.fileUploadTrx.transactionHash = data.trxData.transactionHash;
          // this.fileUploadTrx.transactionIndex = data.trxData.transactionIndex;
          // this.fileUploadTrx.blockHash = data.trxData.blockHash;
          // this.fileUploadTrx.blockNumber = data.trxData.blockNumber;
          // this.fileUploadTrx.gasUsed = data.trxData.gasUsed;
          // this.fileUploadTrx.ipfsHash = data.ipfsHash;
          // this.fileUploadTrx.from = data.from;
          // this.trxDataList.push(this.fileUploadTrx);
          // this.uploadedPercentage = 0;
          break;
        case 1: {
          if (Math.round(this.uploadedPercentage) !== Math.round(event['loaded'] / event['total'] * 100)) {
            this.uploadedPercentage = event['loaded'] / event['total'] * 100;
          }
          break;
        }
      }
    },
    error => {
      console.log(error);
      this.showMessage = true;
    });
  }

}
