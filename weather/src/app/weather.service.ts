import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  APP_URL =
  'https://api.openweathermap.org/data/2.5/weather';

  APP_ID = '074947cb7207d2d8ffe8e64495531826';

  constructor(
    private httpClient: HttpClient
  ) { }

  getByLatNLon(lat, lon) {
    const url = this.APP_URL + '?lat=' + lat + '&lon=' + lon + '&appid=' + this.APP_ID;
    return this.httpClient.get(url);
  }

  getByZipCode(zipCode: string) {
    const url = `${this.APP_URL}?zip=${zipCode},us&appid=${this.APP_ID}`;
    return this.httpClient.get(url);
  }
}
