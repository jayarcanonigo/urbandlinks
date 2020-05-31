import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../config/auth-constants';
import { CartService } from '../services/cart.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { ModalController, NavController } from '@ionic/angular';
import { LocationService } from '../services/location.service';
import { Plugins } from '@capacitor/core';
import { JobsService } from '../services/jobs.service';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../model/model';
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
  public cagtegories: Observable<Category[]>;
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
     public zone: NgZone,
     private categoriesService: CategoriesService,
     public navCtrl: NavController
    ) {
      this.cagtegories = this.categoriesService.getCategories();
      this.currentLocation = location.getFormattedAddres();
     }

  ngOnInit() {
    this.cartItemCount = this.jobService.getServiceItemCount();
    this.loadMap();
    console.log('inimap');
    
  }

    pushPage(){
    // push another page onto the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    this.navCtrl.navigateForward('order');
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
            this.location.setFormattedAddress(result.formatted_address);
            this.location.setAddress({
              name: result.formatted_address,
              latitude: request.latLng.lat,
              longitude: request.latLng.lng

            })
            console.log('result.formatted_address' +result.formatted_address);
             
           
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
