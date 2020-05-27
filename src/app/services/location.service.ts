import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private currentLocation = new BehaviorSubject("");
  constructor() { }

  getCurrentLocation(){
    return this.currentLocation;
  }

  setCurrentLocation(location: string){
    this.currentLocation.next(location);
  }
}
