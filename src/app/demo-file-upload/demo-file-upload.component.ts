import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Buffer } from 'buffer';

import { Globals } from '../globals';

@Component({
  selector: 'app-demo-file-upload',
  templateUrl: './demo-file-upload.component.html',
  styleUrls: ['./demo-file-upload.component.css']
})
export class DemoFileUploadComponent implements OnInit {

  selectedFile: File = null;
  uploadedPercentage = 0;
  showMessage = false;
  message: String = '';
  citizen: String = '';

  constructor(
    private http: HttpClient,
    private globals: Globals
  ) { }

  ngOnInit() {
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload() {
    const fd = new FormData();
    this.showMessage = false;
    console.log(this.selectedFile.name);
    console.log(this.citizen);
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.http.post('/ipfs/upload-file/' + this.globals.loggedinUser.username + '/' + this.citizen, fd, {
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
          this.uploadedPercentage = 0;
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
