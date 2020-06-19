import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { ToastController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';
import { AuthConstants } from '../../config/auth-constants';
import { Facebook } from '@ionic-native/facebook/ngx';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../model/model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
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
    address: null
  };
  public authenticate = {
    user_name: "",
    pwd: ""
  };
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageServices: StorageService,
    private toastCtrl: ToastService,
    private fb: Facebook,
    public loadingController: LoadingController,
    private platform: Platform,
    public alertController: AlertController,
    private aFauth: AngularFireAuth,
  ) { }

  ngOnInit() {
  }

  loginAction() {

    this.authService.getUser(this.authenticate.user_name).subscribe(user => {
      console.log("Exists : ", user);
      if (user) {
        if (user.password == this.authenticate.pwd) {
          this.storageServices.store(AuthConstants.AUTH, this.authenticate);
          this.router.navigate(['dashboard']);
        } else {
          this.toastCtrl.presentToast('Incorrect username or password');
        }

      } else {
        this.toastCtrl.presentToast('Incorrect username or password');
      }
    });

  }

  loginPhoneNumber() {
    this.router.navigate(['verification']);
  }

  async doFbLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    //the permissions your facebook app needs from the user
    const permissions = ["public_profile", "email"];

    this.fb.login(permissions)
      .then(response => {
        let userId = response.authResponse.userID;
        //Getting name and email properties
        //Learn more about permissions in https://developers.facebook.com/docs/facebook-login/permissions

        this.fb.api("/me?fields=name,email", permissions)
          .then(user => {
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";

            //now we have the users info, let's save it in the NativeStorage

            const facebook_cred = auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

            this.aFauth.signInWithCredential(facebook_cred).then(response => {

              this.user.uid = response.user.uid;
              this.user.imageURL = user.picture;
            
                this.storageServices.store(AuthConstants.USER_ID, this.authService.addUserFromFB(this.user)).then(() => {
                  this.router.navigate(["/home/jobs"]);
                  loading.dismiss();
                }, error => {
                  console.log(error);
                  loading.dismiss();
                });
           

            })


          })
      }, error => {
        console.log(error);
        if (!this.platform.is('cordova')) {
          this.presentAlert('Cordova is not available on desktop. Please try this in a real device or in an emulator.');
        }
        loading.dismiss();
      });
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


  async presentLoading(loading) {
    return await loading.present();
  }

}
