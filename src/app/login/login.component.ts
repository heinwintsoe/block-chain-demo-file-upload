import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

import { Globals } from '../globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() username: string;
  @Input() password: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private globals: Globals) {
  }

  ngOnInit() {
  }

  login() {
    console.log(this.username);
    this.http.post('user/find-by-username/' + this.username, {})
      .subscribe(res => {
        console.log(res);
        const userInfo = res[0];
        if (this.username === userInfo.username && this.password === userInfo.password) {
          this.globals.loggedIn = true;
          this.globals.loggedinUser = userInfo;
          this.router.navigate(['app-uploaded-files']);
        } else  {
          alert('Invalid credentials.');
        }
      }, (err) => {
        console.log(err);
      });
  }

}
