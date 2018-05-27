import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DemoFileUploadComponent } from './demo-file-upload/demo-file-upload.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', component: DemoFileUploadComponent },
  { path: 'app-about', component: AboutComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
