import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'weather';
  geoBlocked = false;
  locations: any[];
  constructor(
    private weatherService: WeatherService,
    public authService: AuthService
  ) {
    this.getLocation();
    this.authService.signIn();
  }

  ngOnInit() {
    this.authService.getLocations().then(res => this.locations = res);
  }

  getLocation() {
    if (navigator.geolocation) {
      console.log('get location');
      navigator.geolocation.getCurrentPosition((local) =>
      this.getByLatNLon(local.coords.latitude, local.coords.longitude), (error) => this.geoBlocked = true, {timeout: 3000});
    } else {
      console.log('no local');
    }
  }

  getByLatNLon(lat, long) {
    console.log(lat, long)
    this.weatherService.getByLatNLon(lat, long).subscribe(res => console.log(res))
  }

  getByZipCode(zip) {
    if(!zip) return;
    this.weatherService.getByZipCode(zip).subscribe((res: any) => {
      // add location to gaia
      this.authService.addLocation({ name: res.name, coord: res.coord, zip});
    });
  }

}
