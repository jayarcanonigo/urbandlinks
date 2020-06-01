import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Schedule } from '../../model/model';
import { ScheduleService } from '../../services/schedule.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @Input('schedule') schedule: Schedule;
  @Input() form: FormGroup;
  imageUrl : string;
  currentLocation: Observable<string>;
  constructor(private router: Router, private location: LocationService,
    private camera: Camera, private actionSheetController: ActionSheetController,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    console.log('image',this.schedule);
    if(this.schedule){
      console.log('image',this.schedule.imageURL);      
       this.imageUrl = this.schedule.imageURL;
      this.validateImageFormControl();
    }
    
    this.currentLocation = this.location.getFormattedAddres();
  }

  validateImageFormControl(){
    this.form.get('infoGroup').get('image').setValue(this.schedule.imageURL);
    this.form.get('infoGroup').get('image').updateValueAndValidity()
  }

  gotoLocation() {
    this.router.navigate(['home/google-map']);
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    console.log(sourceType);

    var options: CameraOptions = {
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL
    };


    this.camera.getPicture({
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL
    }

    ).then((imageData) => {
      this.imageUrl = 'data:image/jpeg;base64,' + imageData;
      this.scheduleService.imageUrl = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
    });

  }
}