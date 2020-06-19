import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { Schedule } from '../../model/model';
import { ScheduleService } from '../../services/schedule.service';
import { FormGroup, FormControl } from '@angular/forms';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { ToastService } from '../../services/toast.service';
import { GoogleMapPage } from '../../pages/google-map/google-map.page';

const STORAGE_KEY = 'my_images';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @Input('schedule') schedule: Schedule;
  @Input() form: FormGroup;
  images: string;
  STORAGE_KEY = "images";
  loading: any;
  imageUrl: string;
  currentLocation: Observable<string>;
  constructor(private router: Router, private location: LocationService, private toastService: ToastService,
    private camera: Camera, private actionSheetController: ActionSheetController, public platform: Platform,
    private scheduleService: ScheduleService, private ref: ChangeDetectorRef, private filePath: FilePath,
    private file: File, public loadingCtrl: LoadingController, private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log('image', this.schedule);
    if (this.schedule) {
      this.imageUrl = this.schedule.imageURL;
      this.validateImageFormControl(this.schedule.imageURL);
    }
    this.currentLocation = this.location.getFormattedAddres();
    if (this.currentLocation) {
      this.validateAddressFormControl(this.currentLocation)
    }

  }

  validateAddressFormControl(address) {
    console.log("true address");
    const addressForm: FormControl = this.form.get('infoGroup').get('address') as FormControl;
    addressForm.setValue(address);
   
  }
  validateImageFormControl(image) {
    const imageControl: FormControl = this.form.get('infoGroup').get('image') as FormControl;
    imageControl.setValue(image);    
  }

  async gotoLocation() {

    let modal = await this.modalCtrl.create({
      component: GoogleMapPage,
      cssClass: 'cart-modal'
    });
    modal.onWillDismiss().then(() => {

    })
    modal.present();


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



  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }







  async takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    this.camera.getPicture(options).then(imagePath => {

      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            this.scheduleService.imageFullPath = filePath;
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));

            this.file.readAsDataURL(correctPath, currentName).then(dataurl => {
              this.imageUrl = dataurl;
              this.validateImageFormControl(this.imageUrl);
              this.loading.onDidDismiss();
            },
              (error) => {
                // this.toastCtrl.presentToast(error.message);
              });
            // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.scheduleService.imageFullPath = imagePath;
        this.file.readAsDataURL(correctPath, currentName).then(dataurl => {
          this.imageUrl = dataurl;
          this.validateImageFormControl(this.imageUrl);
          this.loading.onDidDismiss();
        },
          (error) => {
            // this.toastCtrl.presentToast(error.message);
          });
      }
    });


    // takePicture(sourceType: PictureSourceType) {
    //   console.log(sourceType);

    //   var options: CameraOptions = {
    //     sourceType: sourceType,
    //     destinationType: this.camera.DestinationType.DATA_URL
    //   };


    //   this.camera.getPicture({
    //     sourceType: sourceType,
    //     destinationType: this.camera.DestinationType.DATA_URL
    //   }

    //   ).then((imageData) => {
    //     this.imageUrl = 'data:image/jpeg;base64,' + imageData;
    //     this.scheduleService.imageUrl = 'data:image/jpeg;base64,' + imageData;
    //     this.validateImageFormControl('data:image/jpeg;base64,' + imageData);
    //   }, (err) => {
    //     // Handle error
    //     console.log("Camera issue:" + err);
    //   });

    // }
  }
}