import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Address } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private currentLocation = new BehaviorSubject("");
  private address = new BehaviorSubject<Address>(null); 
  constructor() { }

  getFormattedAddres(){
    return this.currentLocation;
  }

  setFormattedAddress(location: string){
    this.currentLocation.next(location);
  }

  setAddress(address: Address){
      this.address.next(address);
  }

  getAddress(){
   return this.address;
  }
}
