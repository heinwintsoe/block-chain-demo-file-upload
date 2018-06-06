import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

import { Globals } from '../globals';
import { FileUploadTransaction } from '../models/file-upload-transaction.model';

@Component({
  selector: 'app-uploaded-files',
  templateUrl: './uploaded-files.component.html',
  styleUrls: ['./uploaded-files.component.css']
})
export class UploadedFilesComponent implements OnInit {

  uploadedFiles: FileUploadTransaction[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private globals: Globals
  ) { }

  ngOnInit() {
    this.onLoadExistingTrxs();
  }

  onLoadExistingTrxs() {
    const username = this.globals.loggedinUser.username;
    this.http.get('/ipfs/find-all/' + username).subscribe(
      (response) => {
        for (const index in response) {
          if (response.hasOwnProperty('data')) {
            const docs = response[index];
            for (let i = 0; i < docs.length; i++) {
              const doc = docs[i];
              const fileUploadTrx = new FileUploadTransaction();
              fileUploadTrx.transactionHash = doc.trxHash;
              fileUploadTrx.from = doc.owner;
              fileUploadTrx.citizen = doc.citizen;
              fileUploadTrx.uploadedDate = doc.uploaded_date;
              this.uploadedFiles.push(fileUploadTrx);
            }
          }
        }
      },
      error => {
        console.log(error);
      });
  }

  onSelect(uploadedFile: FileUploadTransaction) {
    this.router.navigate(['app-file-details/' + uploadedFile.transactionHash]);
    console.log(uploadedFile);
  }

}
