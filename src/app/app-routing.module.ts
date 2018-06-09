import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DemoFileUploadComponent } from './demo-file-upload/demo-file-upload.component';
import { AboutComponent } from './about/about.component';
import { UploadedFilesComponent } from './uploaded-files/uploaded-files.component';
import { FileDetailsComponent } from './file-details/file-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'app-upload', component: DemoFileUploadComponent },
  { path: 'app-uploaded-files', component: UploadedFilesComponent },
  { path: 'app-file-details/:address', component: FileDetailsComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
