import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestProvider } from '../../model/model';
import { ToastService } from '../../services/toast.service';
import { AlertController } from '@ionic/angular';
import { AppConstant } from '../../config/app-contants';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-bookingdetails',
  templateUrl: './bookingdetails.page.html',
  styleUrls: ['./bookingdetails.page.scss'],
})
export class BookingdetailsPage implements OnInit {
  requestId: string;
  public data: any;
  constructor(
    private requestService: RequestService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router,
    public alertController: AlertController,    
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.requestService.getRequestProvider(this.requestId).subscribe(data => {
      this.data = data;

      console.log(data);
      

    });
  }

  updateRequestProviderStatus(status: string) {
    if (status === 'To Do') {
      this.presentAlert(status, AppConstant.TO_DO, AppConstant.ACCEPT_REQUEST, this.data.userId.token );
    } else if (status === 'In Progress') {
      this.presentAlert(status, AppConstant.IN_PROGRESS, AppConstant.START_REQUEST, this.data.userId.token);
    } else if (status === 'Past') {
      this.presentAlert(status, AppConstant.PAST, AppConstant.COMPLETE_REQUEST, this.data.userId.token);
    }

  }

  async presentAlert(status: string, message: string, notification: string, token: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Booking Detail',
      message: message,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.data.status = status;
            this.requestService.updateRequestProvider(this.data);
            this.notificationService.sendNotification(notification, token);
            this.router.navigate(['dashboard'])
          }
        }
      ]
    });

    await alert.present();
  }

}
