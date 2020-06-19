import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { NavController, ModalController } from '@ionic/angular';
import { sync } from 'glob';
import { black } from 'color-name';
import { async } from '@angular/core/testing';
import { ToastService } from '../../services/toast.service';
import { ScheduleService } from '../../services/schedule.service';

const { Geolocation } = Plugins;

declare var google;
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.page.html',
  styleUrls: ['./google-map.page.scss'],
})
export class GoogleMapPage implements OnInit {

  @ViewChild('map', { static: true }) mapElement: ElementRef;
  address: string;
  numDeltas = 100;
  name: string = 'tests';
  map: any;
  markers = [];
  myLat = 10;
  myLong: number;
  locationsCollection
  constructor(public zone: NgZone,
    private location: LocationService,
    private scheduleService: ScheduleService,
    private navCtrl: NavController,
    private toastService: ToastService,
    private modalCtrl: ModalController
  ) {

  }

  ngOnInit() {
    this.name = 'Nancy';
    this.loadMap();

  }

  async goBack() {
    this.location.setFormattedAddress(document.getElementById('address').innerHTML);
    await this.location.setAddress({
      name: document.getElementById('address').innerHTML,
      latitude: parseInt(document.getElementById('latitude').innerHTML),
      longitude: parseInt(document.getElementById('longitude').innerHTML)
    })
    this.toastService.presentToast("Location updated")
    this.scheduleService.isAddressDistry = true;   
     this.modalCtrl.dismiss();

  
  }
  loadMap() {
    const result = Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.myLat = latLng.latitude;

      this.location.getFormattedAddres().subscribe(location => {
        setLocation(location, position.coords.latitude, position.coords.longitude)
      });

      let mapOptions = {
        center: latLng,
        zoom: 50
      };
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var myMarker = new google.maps.Marker({
        position: latLng,
        draggable: false,
        map: map,
        icon: {
          url: '/assets/images/pinicon.png',
          labelOrigin: new google.maps.Point(10, -15)
        },
        labelClass: "labels",
        animation: google.maps.Animation.BOUNCE,
        labelPostion: '',
        label: {
          fontSize: "8pt",
          text: "Drag to adjust",
        }
      });

      google.maps.event.addListener(myMarker, 'dragend', function () {
        map.setCenter(this.getPosition()); // Set map center to marker position

      });

      google.maps.event.addListener(map, 'drag', function () {
        myMarker.setPosition(this.getCenter()); // set marker position to map center
        let request = this.getCenter();

        window.setTimeout(function () {
          updatePosition(request.lat(), request.lng()); // update position display
        }, 1000);
      });

      google.maps.event.addListener(map, 'dragend', function () {
        myMarker.setPosition(this.getCenter()); // set marker position to map c
        let request = this.getCenter();
        window.setTimeout(function () {
          updatePosition(request.lat(), request.lng()); // update position display
        }, 1000);
      });

      function pinSymbol(color) {
        return {
          path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#000',
          strokeWeight: 2,
          scale: 2
        };
      }
      function setLocation(address, latitude, longitude) {
        if (document.getElementById('address')) {
          document.getElementById('address').innerHTML = address;
          document.getElementById('latitude').innerHTML = latitude;
          document.getElementById('longitude').innerHTML = longitude;
        }


      }

      function toggleBounce() {
        myMarker.setAnimation(google.maps.Animation.BOUNCE);
      }
      async function updatePosition(lat, lng) {
        if (navigator.geolocation) {

          let geocoder = new google.maps.Geocoder();
          let latlng = new google.maps.LatLng(lat, lng);
          let request = { latLng: latlng };

          await geocoder.geocode(request, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              let result = results[0];
              if (result != null) {
                setLocation(result.formatted_address, lat, lng);
              }

            }
          });
        }
      }



    }).catch((error) => {
      console.log('Error getting location', error);
    });
    result.then(result => {
      console.log('console.log(result);', result);

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
        console.log(position.coords.latitude, ', ', position.coords.longitude);

        this.myLat = position.coords.latitude;
        this.myLong = position.coords.longitude;
        this.getGeoLocation(position.coords.latitude, position.coords.longitude);
        resolve(true);

      }, (err) => {

        reject('Could not initialise map');

      });

    });

  }

  async getGeoLocation(lat, lang, type?) {
    if (navigator.geolocation) {

      let geocoder = await new google.maps.Geocoder();
      let latlng = await new google.maps.LatLng(lat, lang);
      let request = { latLng: latlng };

      await geocoder.geocode(request, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];
          this.zone.run(() => {
            if (result != null) {
              this.location.setFormattedAddress(result.formatted_address);

              if (type === 'reverseGeocode') {
                this.location.setFormattedAddress(result.formatted_address);
                console.log('result.reverseGeocode' + result.formatted_address);
              }
            }
          })
        }
      });
    }
  }

  testMarker() {

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
