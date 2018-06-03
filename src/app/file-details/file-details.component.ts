import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Globals } from '../globals';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css']
})
export class FileDetailsComponent implements OnInit {

  fileShared = false;

  fileShareFailed = false;

  fileDetails;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private globals: Globals
  ) { }

  ngOnInit() {
    this.getFileDetails();
  }

  getFileDetails() {
    const selectedFileAddress = this.route.snapshot.paramMap.get('address');
    this.http.get('/ipfs/find-details/' + selectedFileAddress).subscribe(
      (res) => {
        this.fileDetails = res['data'].fileDetails;
      },
      error => {
        console.log(error);
      });
  }

  goBack(): void {
    this.location.back();
  }

  shareFile(): void {
    const postUrl = 'http://localhost:3000/api/org.citizenVault.model.Artefact';
    const data = {
      data: [ this.fileDetails.fileUrl ],
      issuer: {},
      owner: {},
      requests: [],
      authorized: []
    };
    this.http.post(postUrl, data, {
      reportProgress: true, observe: 'events'
    }).subscribe(
      (resp) => {
        console.log(resp);
        this.fileShared = true;
        this.fileShareFailed = false;
      },
      (err) => {
        console.log(err);
        this.fileShared = false;
        this.fileShareFailed = true;
      }
    );
  }

}
