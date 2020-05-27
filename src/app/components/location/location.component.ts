import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {Plugins} from '@capacitor/core';
import { Observable } from 'rxjs';
import { LocationService } from '../../services/location.service';

const{Geolocation} = Plugins;

declare var google;
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {

  
  @ViewChild('map',{static : true}) mapElement: ElementRef;
  numDeltas = 100;
  name: string = 'tests';
  map: any;
  markers = [];
   myLat =  10;
   myLong: number;
  locationsCollection
  constructor(public zone: NgZone, 
    private location: LocationService) {
     
     }

  ngOnInit() {
    this.name = 'Nancy';
    this.initMap();
    
  }

     loadMap(){
       const result = Geolocation.getCurrentPosition().then((position) => {
          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.myLat =  latLng.latitude;
          console.log( ' this.myLat' + this.myLat);
          
          let mapOptions = {
              center: latLng,
              zoom: 15
          };
          
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          let marker = new google.maps.Marker({
            map: this.map,
            position: latLng,

          });
       
          

  }).catch((error) => {
    console.log('Error getting location', error);
  });
  result.then(result => {
    console.log('console.log(result);',result);
    
  })


 
    
  }



  async getCurrentPosition() {    
    const coordinates = await Geolocation.getCurrentPosition();
  }

  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
      console.log(position);
      
    })
  }

  private initMap(): Promise<any> {

    return new Promise((resolve, reject) => {

        Geolocation.getCurrentPosition().then((position) => {

      

            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            let mapOptions = {
                center: latLng,
                zoom: 15
            };

           
          

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            console.log(this.map);
            let marker = new google.maps.Marker({
              map: this.map,
              position: latLng,

            });
            console.log(position.coords.latitude , ', ', position.coords.longitude);
            
            this.myLat = position.coords.latitude;
            this.myLong = position.coords.longitude;
            this.getGeoLocation(this.myLong);
            resolve(true);

        }, (err) => {

            reject('Could not initialise map');

        });

    });

}

async getGeoLocation( myLong , type?) {
  this.name = 'test';
  if (navigator.geolocation) {
    console.log(this.myLat, myLong);
    
    let geocoder = await new google.maps.Geocoder();
    let latlng = await new google.maps.LatLng(this.myLat, this.myLong);
    let request = { latLng: latlng };

    await geocoder.geocode(request, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        let result = results[0];
        this.zone.run(() => {
          if (result != null) {
            this.location.setCurrentLocation(result.formatted_address);
            console.log('result.formatted_address' +result.formatted_address);
             
            if (type === 'reverseGeocode') {
              this.location.setCurrentLocation(result.formatted_address);
              console.log('result.reverseGeocode' +result.formatted_address);           
            }
          }
        })
      }
    });
  }
}

testMarker(){

  let center = this.map.getCenter();
  this.addMarker(center.lat(), center.lng());

}
public addMarker(lat: number, lng: number): void {

  let latLng = new google.maps.LatLng(lat, lng);

  let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
  });

  this.markers.push(marker);

}

}
