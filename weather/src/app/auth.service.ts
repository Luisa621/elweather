import { Injectable } from "@angular/core";
import * as blockstack from "blockstack";
import { UserData } from "blockstack/lib/auth/authApp";
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  appConfig = new blockstack.AppConfig();
  userSession = new blockstack.UserSession({ appConfig: this.appConfig });
  userData: UserData;
  userProfile;
  locations = [];
  locations$ = from(this.locations);

  constructor() {}

  signIn() {
    if (this.userSession.isUserSignedIn()) {
      this.userData = this.userSession.loadUserData();
      this.userProfile = new blockstack.Person(this.userData)._profile;
    } else if (this.userSession.isSignInPending()) {
      this.userSession.handlePendingSignIn().then(userData => {
        this.userData = userData;
        this.userData = this.userSession.loadUserData();
        this.userProfile = new blockstack.Person(this.userData)._profile;
      });
    } else {
      this.userSession.redirectToSignIn();
    }
  }

  signOut() {
    this.userSession.signUserOut();
  }

  getLocations() {
    return this.userSession.getFile('locations.json', { decrypt: true })
    .then((res: any) => {
      if (!res) {
        // add blank file
        this.addEmptyLocations();
        return [];
      } else {
        return this.locations = JSON.parse(res);
      }
    });
  }

  addLocation(location) {
    const locals = [...this.locations, location];
    this.userSession.putFile('locations.json', JSON.stringify(locals), { encrypt: true })
    .then((res) => {
      if (res) {
        // add blank file
        this.locations = locals;
        this.locations$ = from(this.locations);
      }
    });
  }

  private addEmptyLocations() {
    const obj = JSON.stringify([]);
    this.userSession.putFile('locations.json', obj, { encrypt: true })
    .then((res) => {
      if (!res) {
        // add blank file
      }
    });
  }
}
