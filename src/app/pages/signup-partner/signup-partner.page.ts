import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { User } from '../../model/user.model';
import { FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from "firebase";
import { WindowService } from '../../services/window.service';
import { StorageService } from '../../services/storage.service';
import { AuthConstants } from '../../config/auth-constants';
import { VerificationService } from '../../services/verification.service';

@Component({
  selector: 'app-signup-partner',
  templateUrl: './signup-partner.page.html',
  styleUrls: ['./signup-partner.page.scss'],
})
export class SignupPartnerPage implements OnInit {

  windowRef: any;
  verificationCode: string;
  recaptchaVerifier;
  applicationVerifier;
  verificationId: string;
  private token: string;
  public code: string;
  verificationDiv: boolean = false;
  provider;
  public confirmationResult: firebase.auth.ConfirmationResult;
  optsent = false;
  phoneNumber;
  hide = true;
  conhide = true;
  confirmPassword: String = "";
  user: User = {
    phoneNumber: "",
    lastName: "",
    firstName: "",
    password: "",
    verificationId: ""
  };

  constructor(private router: Router,
    private toastCtrl: ToastController,
    private authService: AuthService,
    public af: AngularFireAuth,
    public win: WindowService,
    private storageServices: StorageService,
    private vericationService: VerificationService
  ) { }

  ngOnInit() {

    /*this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')

    this.windowRef.recaptchaVerifier.render()*/
     

  }

  navigateToLogin() {
    console.log(this.user);
    if (this.authService.checkUserExists(this.user)) {
      this.showToast('Phone number already exists');
    } else {
      this.storageServices.store(AuthConstants.AUTH, this.user);
      this.authService.addUser(this.user);
      this.router.navigate(['home']);
    }

  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }


  sendLoginCode() {
   console.log('user: '+this.user);
   
    //let dataObj = JSON.stringify(this.user);
  /*  this.router.navigate(['verification', {
      queryParams: {
          value: JSON.stringify(this.user.firstName)
      }
  }]);
*/
   /* var phoneNumber = '+63' + this.user.phoneNumber;
    var appVerifier = this.windowRef.recaptchaVerifier;
    console.log('appVerifier' + appVerifier);
    

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function(confirmationResult) {
        console.log("confirmationResult", confirmationResult);
        console.log('confirmationResult.verificationId' + confirmationResult.verificationId);
        
        this.windowRef.confirmationResult  = confirmationResult;
      })
      .catch(function(error) {
        console.log("error", error);
      });

*/


    const appVerifier = this.windowRef.recaptchaVerifier;


    //+639287995743
    firebase.auth().signInWithPhoneNumber('+63' + this.user.phoneNumber, appVerifier)
      .then(result => {
        console.log('confirmationResult.verificationId' + result.verificationId);
        this.user.verificationId= result.verificationId;
        this.windowRef.confirmationResult = result;
        this.verificationDiv = true;
        this.router.navigate(['verification'], {
          queryParams: {
              value: JSON.stringify(this.user)
          }
      });

      })
      .catch(error => console.log(error));
                                                
      
     
  }

  /*var provider = new firebase.auth.PhoneAuthProvider();
  provider.verifyPhoneNumber('+639085356258', applicationVerifier)
      .then(function(verificationId) {
        var verificationCode = window.prompt('Please enter the verification ' +
            'code that was sent to your mobile device.');
        return firebase.auth.PhoneAuthProvider.credential(verificationId,
            verificationCode);
      })
      .then(function(phoneCredential) {
        return firebase.auth().signInWithCredential(phoneCredential).then(res=>{
          console.log(res);
          
        });
      });*/ 

  sendVerification() {
    this.windowRef.confirmationResult
      .confirm(this.code)
      .then(result => {
        console.log(result.user);
        if (this.authService.checkUserExists(this.user)) {
          this.showToast('Phone number already exists');
        } else {
          this.authService.addUser(this.user);
          this.storageServices.store(AuthConstants.AUTH, this.user);
          this.router.navigate(['home']);
        }
        //this.user = result.user;

      })
      .catch(error => console.log(error, "Incorrect code entered?"));
  }
}
