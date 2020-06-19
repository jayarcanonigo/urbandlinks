import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { AuthConstants } from '../../config/auth-constants';
import { User } from '../../model/model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user;

  constructor(private authService: AuthService, private storeSevice: StorageService) { }

  ngOnInit() {
    this.storeSevice.get(AuthConstants.USER_ID).then(userId => {
      if (userId)
        this.authService.getUser(userId).subscribe(data => {
          this.user = data;
        });
    });
  }

}
