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
    this.http.get('/ipfs/certificate-details/' + selectedFileAddress).subscribe(
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
    const artefact = new Artefact();
    artefact.id = this.fileDetails.blockHash;
    artefact.name = this.fileDetails.certificate.gceLevel + ' Levels';
    if (this.fileDetails.certificate.gceLevel === 'O') {
      artefact.data = this.getOLevelSubjects();
    } else {
      artefact.data = this.getALevelSubjects();
    }
    artefact.issuer = 'resource:org.citizenVault.model.Agency#MOE';
    artefact.owner = 'resource:org.citizenVault.model.Citizen#' + this.fileDetails.certificate.nirc;
    artefact.file = this.fileDetails.fileUrl;

    const artefactJson = JSON.parse(JSON.stringify(artefact));
    this.http.post(this.globals.config.artefactUrl, artefactJson, {
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

  getOLevelSubjects() {
    const english = new ArtefactData();
    english.name = 'English';
    english.value = this.fileDetails.certificate.englishGrade;
    const mathematics = new ArtefactData();
    mathematics.name = 'Mathematics';
    mathematics.value = this.fileDetails.certificate.mathGrade;
    const motherTongue = new ArtefactData();
    motherTongue.name = 'MotherTongue';
    motherTongue.value = this.fileDetails.certificate.motherTongueGrade;
    const science = new ArtefactData();
    science.name = 'Science';
    science.value = this.fileDetails.certificate.scienceGrade;
    const grades = [ english, mathematics, motherTongue, science];
    return grades;
  }

  getALevelSubjects() {
    const english = new ArtefactData();
    english.name = 'English';
    english.value = this.fileDetails.certificate.englishGrade;
    const mathematics = new ArtefactData();
    mathematics.name = 'Mathematics';
    mathematics.value = this.fileDetails.certificate.mathGrade;
    const motherTongue = new ArtefactData();
    motherTongue.name = 'MotherTongue';
    motherTongue.value = this.fileDetails.certificate.motherTongueGrade;
    const chemistry = new ArtefactData();
    chemistry.name = 'Chemistry';
    chemistry.value = this.fileDetails.certificate.chemistryGrade;
    const bio = new ArtefactData();
    bio.name = 'Bio';
    bio.value = this.fileDetails.certificate.bioGrade;
    const geography = new ArtefactData();
    geography.name = 'Geography';
    geography.value = this.fileDetails.certificate.geographyGrade;
    const history = new ArtefactData();
    history.name = 'History';
    history.value = this.fileDetails.certificate.historyGrade;
    const grades = [ english, mathematics, motherTongue, chemistry, bio, geography, history];
    return grades;
  }

}
