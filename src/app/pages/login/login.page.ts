import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { ToastController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';
import { AuthConstants } from '../../config/auth-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public authenticate = {
    user_name: "",
    pwd: ""
  };
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageServices: StorageService,
    private toastCtrl: ToastService
  ) { }

  ngOnInit() {
  }

  loginAction() {

    this.authService.getUser(this.authenticate.user_name).subscribe(user => {
      console.log("Exists : ", user);
      if (user) {
        if (user.password == this.authenticate.pwd) {
          this.storageServices.store(AuthConstants.AUTH, this.authenticate);
          this.router.navigate(['home']);
        } else {
          this.toastCtrl.presentToast('Incorrect username or password');
        }

      } else {
        this.toastCtrl.presentToast('Incorrect username or password');
      }
    });

  }

  loginPhoneNumber(){
    this.router.navigate(['verification']);
  }
  
}
