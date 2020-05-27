import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../config/auth-constants';
import { CartService } from '../services/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { ModalController } from '@ionic/angular';
import { LocationService } from '../services/location.service';
import { Plugins } from '@capacitor/core';
import { JobsService } from '../services/jobs.service';
const{Geolocation} = Plugins;
declare var google;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  cartItemCount: BehaviorSubject<number>;
  currentLocation: BehaviorSubject<string>;
  public selectedIndex = 0;
  map: any;
  public appPages = [
    {
      title: 'Dashboard',
      url: '/home/',
      icon: 'apps'
    },
    {
      title: 'Profile',
      url: '/home/profile',
      icon: 'person'
    },
    {
      title: 'Order',
      url: '/home/order',
      icon: 'cart'
    }
    ,
    {
      title: 'Your Location',
      url: '/home/google-map',
      icon: 'location'
    },
    {
      title: 'Service',
      url: '/home/todo-list',
      icon: 'cog'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private storageService: StorageService,
     private router: Router,
     private jobService: JobsService,
     private modalCtrl: ModalController,
     private location: LocationService,
     public zone: NgZone
    ) {

      this.currentLocation = location.getCurrentLocation();
     }

  ngOnInit() {
    this.cartItemCount = this.jobService.getServiceItemCount();
    this.loadMap();
    console.log('inimap');
    
  }

  logout(){
    this.router.navigate(['']);
    this.storageService.clear();    
  }

  loadMap() {
    Geolocation.getCurrentPosition().then((resp) => {    
    this.getGeoLocation(resp.coords.latitude, resp.coords.longitude);

    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  private initMap(): Promise<any> {

    return new Promise((resolve, reject) => {

        Geolocation.getCurrentPosition().then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.getGeoLocation(position.coords.latitude, position.coords.longitude);
            resolve(true);

        }, (err) => {

            reject('Could not initialise map');

        });

    });

}

async getGeoLocation(lat: number, lng: number, type?) {
  if (navigator.geolocation) {
    let geocoder = await new google.maps.Geocoder();
    let latlng = await new google.maps.LatLng(lat, lng);
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
            }
          }
        })
      }
    });
  }
}

  async openCart(){  
    
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
   
    modal.present();
  }

  
  gotoLocation(){
    this.router.navigate(['home/google-map']);
  }

  
}
