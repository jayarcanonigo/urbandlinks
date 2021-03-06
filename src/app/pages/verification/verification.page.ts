import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { WindowService } from '../../services/window.service';
import { StorageService } from '../../services/storage.service';
import * as firebase from 'firebase';
import { User } from '../../model/model';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastService } from '../../services/toast.service';
import { AuthConstants } from '../../config/auth-constants';
import { stringify } from '@angular/compiler/src/util';
@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  public code: number;
  public phoneNumber: number;
  uid: string;
  user: User = {
    userId: '',
    phoneNumber: '',
    imageURL: '',
    imagePath: '',
    lastName: '',
    firstName: '',
    password: '',
    uid: '',
    address: null,
    token: ''
  };
  windowRef: any;
  constructor(private router: Router,
    private toastCtrl: ToastService,
    private authService: AuthService,
    public af: AngularFireAuth,
    public win: WindowService,
    private storageServices: StorageService,
    private route: ActivatedRoute,
    public alertController: AlertController) {

    /* this.route.queryParams.subscribe((res) => {
      console.log(JSON.parse(res.value));
      
       this.user = JSON.parse(res.value);
      
   });*/
  }

  ngOnInit() {

    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth
      .RecaptchaVerifier("phone-sign-in-recaptcha", {
        size: "invisible",
        callback: function (response) {
          // reCAPTCHA solved - will proceed with submit function
          console.log(response);
        },
        "expired-callback": function () {
          console.log('expired');

        }
      });


  }

  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    //+639287995743
    firebase.auth().signInWithPhoneNumber('+63' + this.phoneNumber, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
      })
      .catch(error => console.log(error));

  }

  async presentAlert(status: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Message <strong>' + status + '</strong>!!!',
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

  sendVerification() {
    this.windowRef.confirmationResult
      .confirm(this.code.toString())
      .then(result => {
        this.uid = JSON.stringify(result.user);
        this.user.phoneNumber = this.phoneNumber + '';
        this.user.uid = result.user.uid;
        console.log(result.user);
        this.storageServices.get(AuthConstants.TOKEN).then(token=>{
          this.user.token = token;
          this.storageServices.store(AuthConstants.USER_ID, this.authService.addUser(this.user));
          this.router.navigate(['home/jobs']);
        })
     


        // 

      })
      .catch(error => {
        this.toastCtrl.presentToast("Incorrect code entered?");
        console.log(error, "Incorrect code entered?");
      });
  }


}
