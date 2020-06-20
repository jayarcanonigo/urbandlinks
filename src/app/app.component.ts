import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from '@ionic-native/fcm/ngx';



import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { StorageService } from './services/storage.service';
import { AuthConstants } from './config/auth-constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  token: string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FCM,
    private afs: AngularFirestore,
    public alertController: AlertController,
    private storageService: StorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
   

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcm.getToken().then(token => {
        this.saveToken(token);
      
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        this.saveToken(token);
      });

      this.fcm.onNotification().subscribe(data => {
        this.presentAlert('', JSON.stringify(data))
        console.log(data);
        if (data.wasTapped) {
        
          console.log('Received in background');
        //  this.router.navigate([data.landing_page, data.price]);
        } else {
          console.log('Received in foreground');
          //this.router.navigate([data.landing_page, data.price]);
        }
      });

      this.fcm.subscribeToTopic('people');
      // FCM.unsubscribeFromTopic('marketing');
    });
       

   
    
  }

  async presentAlert(status: string, message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Booking Detail',
      message: message,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
          
          }
        }
      ]
    });

    await alert.present();
  }

  saveToken(token){
    this.storageService.store(AuthConstants.TOKEN, token);   
  }
}
