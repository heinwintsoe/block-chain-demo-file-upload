import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Globals } from '../globals';

import { Artefact } from '../models/artefact.model';
import { ArtefactData } from '../models/artefact-data.model';

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
        console.log(res);
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
    /*
    const data = {
      "id": this.fileDetails.blockHash,
      "name": "heinwintsoe",
      "data": [ { "name": "artefact", "value": this.fileDetails.fileUrl } ],
      "requests": [""],
      "owner": "resource:org.citizenVault.model.Citizen#" + this.fileDetails.citizen,
      "authorized": [""]
    };
    */
    const artefactData = new ArtefactData();
    artefactData.key = 'artefact';
    artefactData.value = this.fileDetails.fileUrl;

    const artefact = new Artefact();
    artefact.id = this.fileDetails.blockHash;
    artefact.name = 'to-send-file-name';
    artefact.data = [ artefactData ];
    artefact.owner = 'resource:org.citizenVault.model.Citizen#' + this.fileDetails.citizen;

    this.http.post(this.globals.config.artefactUrl, artefact, {
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
