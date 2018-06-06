import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  loggedIn = false;
  loggedinUser;

  config = {
    artefactUrl: 'http://localhost:3000/api/org.citizenVault.model.Artefact',
  };
}
