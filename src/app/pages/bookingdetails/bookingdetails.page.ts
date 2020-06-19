import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestProvider } from '../../model/model';
import { ToastService } from '../../services/toast.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-bookingdetails',
  templateUrl: './bookingdetails.page.html',
  styleUrls: ['./bookingdetails.page.scss'],
})
export class BookingdetailsPage implements OnInit {
  requestId: string;
  public data: RequestProvider;
  constructor(private requestService: RequestService, private route: ActivatedRoute,
    private toastService: ToastService, private router: Router, public alertController: AlertController) { }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    console.log(this.requestId);

    this.requestService.getRequestProvider(this.requestId).subscribe(data => {
      this.data = data;
      console.log(data);

    });
  }

  updateRequestProviderStatus(status: string) {
    this.presentAlert(status);
  }

  async presentAlert(status: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.data.status = status;
            this.requestService.updateRequestProvider(this.data);
            this.toastService.presentToast("Request Accepted.")
            this.router.navigate(['dashboard'])
          }
        }
      ]
    });

    await alert.present();
  }

}
