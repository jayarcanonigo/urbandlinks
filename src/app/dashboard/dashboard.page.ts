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
import { Facebook } from '@ionic-native/facebook/ngx';
import { HttpClient, HttpHeaders   } from '@angular/common/http';
const { Geolocation } = Plugins;
declare var google;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  cartItemCount: BehaviorSubject<number>;
  currentLocation: BehaviorSubject<string>;
  public cagtegories: Observable<Category[]>;
  public selectedIndex = 0;
  map: any;
  constructor(private storageService: StorageService,
    private router: Router,
    private jobService: JobsService,
    private modalCtrl: ModalController,
    private location: LocationService,
    public zone: NgZone,
    private categoriesService: CategoriesService,
    public navCtrl: NavController,
    private authService: AuthService,
    private fb: Facebook,
    private httpClient: HttpClient
  ) {
    this.cagtegories = this.categoriesService.getCategories();
    this.currentLocation = location.getFormattedAddres();

    if (!this.authService.userId) {
      this.storageService.get(AuthConstants.AUTH).then(user => {
        console.log(user);

        this.authService.userId = user.user_name;
      })
    }

  }

  ngOnInit() {
    this.cartItemCount = this.jobService.getServiceItemCount();
    //this.loadMap();
    console.log('inimap');

  }

  pushPage() {
    // push another page onto the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    this.navCtrl.navigateForward('order');
  }

  logout() {

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json' );
    headers.append("Authorization", 'key=AAAAPSIV92U:APA91bEkaReqfZ5S1pyQMq6IBQzFvuHocaKXLOXV0nws-6AaAnYfw6CWnoVZL2G72bwDmYzNg62KzUxmfv0OFK0AUmrtyoMhoWCWMBclsgdhfNKVcDtRIDSnbNzc0AZeN5Nj5ilh_6Ux');
   
  
    let notification = {
      "notification":{
        "title":"Ionic 4 Notification",
        "body":"This notification sent from POSTMAN using Firebase HTTP protocol",
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "landing_page":"second",
        "price":"$3,000.00"
      },
       "to": "cZA2AcRZLC0:APA91bG2lUWFxnnni3SvP3QqXYH7vFVkxqiFRGIqcXuRkReFHR0iBd4N1di3DYT3BPQaenERn37Ghh_i7z8QzkKkqELTLGcYaXILe3qDUe-m2vxuoZZzk7QrGob44J0cFhnUdu-lfPq4",
           "priority":"high",
        "restricted_package_name":""
    }

  

    this.sendPostRequest(notification, headers).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  sendPostRequest(data: any, headers): Observable<any> {
    return this.httpClient.post<any>('https://fcm.googleapis.com/fcm/send', data,    
          {
            headers : new HttpHeaders(
              {
              'Content-Type':'application/json',
              'Authorization':'key=AAAAPSIV92U:APA91bEkaReqfZ5S1pyQMq6IBQzFvuHocaKXLOXV0nws-6AaAnYfw6CWnoVZL2G72bwDmYzNg62KzUxmfv0OFK0AUmrtyoMhoWCWMBclsgdhfNKVcDtRIDSnbNzc0AZeN5Nj5ilh_6Ux'
    
            }
          ) 
          
          } );
  
  }
  //// this.fb.logout();
  //  this.storageService.clear();
  //  this.router.navigate(['']);


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
              console.log('result.formatted_address' + result.formatted_address);


            }
          })
        }
      });
    }
  }

  async openCart() {

    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });

    modal.present();
  }


  gotoLocation() {
    this.router.navigate(['home/google-map']);
  }


}
