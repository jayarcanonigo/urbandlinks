import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule, User, ServiceProvider } from '../../model/model';
import { AuthConstants } from '../../config/auth-constants';
import { LocationService } from '../../services/location.service';
import { Observable } from 'rxjs';
import { TimeScheduleComponent } from '../../components/time-schedule/time-schedule.component';
import { ServiceComponent } from '../../components/service/service.component';
import { ToastService } from '../../services/toast.service';
import { LoadingController } from '@ionic/angular';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { File } from '@ionic-native/file/ngx'
import { AuthService } from '../../services/auth.service';
import { ServiceProviderService } from '../../services/service-provider.service';
@Component({
  selector: 'app-stepper-partner',
  templateUrl: './stepper-partner.page.html',
  styleUrls: ['./stepper-partner.page.scss'],
})
export class StepperPartnerPage implements OnInit {
  form: FormGroup;
  user: User;
  master = 'Master';
  schedule: Schedule;
  categoryId: string;
  userId: string;
  isAdded: boolean = true;
  isTest = false;
  loading: any;
  path: string;
  imageUrl: string;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  jobCount: Observable<number>;

  days = [];
  error: string;
  constructor(private activatedRoute: ActivatedRoute, private storage: StorageService,
    private scheduleService: ScheduleService, private fb: FormBuilder,
    private location: LocationService, private router: Router, private toastService: ToastService,
    public loadingCtrl: LoadingController, private afStorage: AngularFireStorage,
    private file: File, private authService: AuthService, private serviceProvider: ServiceProviderService

  ) {

  }

  ngOnInit() {

    // this.initialize();
    this.activatedRoute.data.subscribe(data => {
      this.schedule = data.data;

    });
    console.log("Data from resolver: ", this.activatedRoute.snapshot.data);

    this.form = new FormGroup({
      'jobsGroup': new FormGroup({
        'jobsArray': this.fb.array([], [Validators.required])
      }),
      'timesGroup': new FormGroup({
        'timesArray': this.fb.array([], [Validators.required])
      }),
      'infoGroup': this.fb.group({
        'address': this.fb.control([], [Validators.required]),
        'image': this.fb.control([], [Validators.required])
      })
    });

    this.fb.group({
      checkArray: this.fb.array([], [Validators.required]),
      timeGroupName: this.fb.array([], [Validators.required])
    })
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.categoryId = id;
    this.jobCount = this.scheduleService.getDaysCount();
    this.storage.get(AuthConstants.USER_ID).then(userId => {
      if (userId)
        this.userId = userId;
    });

    this.days = ['Mon', 'Tue', 'Wen', 'Thur', 'Fri', 'Sat', 'Sun'];
  }

  initialize() {
    this.scheduleService.isAddressDistry = false;
    this.scheduleService.isTimeDirty = false;
    this.scheduleService.isJobDirty = false;
    this.scheduleService.isImageURLDirty = false;
    this.scheduleService.setDays([]);
    this.scheduleService.setJobPartner([]);
    this.location.setAddress(null);
    this.scheduleService.imageFullPath = "";
    this.scheduleService.imageUrl = "";

  }

  async upload(buffer, name) {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    await this.loading.present();
    let blob = new Blob([buffer], { type: `image/jpg` });
    this.ref = this.afStorage.ref(`partner/${name}`);

    this.task = this.ref.put(blob)

    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.imageUrl = url;
          this.path = `partner/${name}`

          if (this.isAdded) {
            this.processAddSchedule();
          } else {
            this.processUpdateSchedule();
          }
          this.loading.onDidDismiss();
          this.toastService.presentToast("Success!!!");
          this.router.navigate(['dashboard']);
          console.log(url); // <-- do what ever you want with the url..
        });
      })
    ).subscribe();


  }
  addPicture() {

    let fileName = this.scheduleService.imageFullPath.substring(this.scheduleService.imageFullPath.lastIndexOf("/") + 1);
    let path = this.scheduleService.imageFullPath.substr(0, this.scheduleService.imageFullPath.lastIndexOf('/') + 1);

    this.file.readAsArrayBuffer(path, fileName).then(async (buffer) => {
      let name = `${new Date().getTime()}`;
      await this.upload(buffer, name);
    }).catch(error => {
      this.toastService.presentToast(error);
    })

  }

  ionViewWillEnter() {



  }

  onSequenceChangeEvent($event) {

    // this.scheduleService.removeDayTime('Mon');
    //console.log($event);

  }
  addSchedule() {
    this.addPicture();
  }

  processAddSchedule() {
    this.addServices();
    this.location.getAddress().subscribe(address => {
      this.authService.getUser(this.userId).subscribe(user=>{
        user.address = address;
        user.imageURL = this.imageUrl;
        user.imagePath = this.path;
        this.authService.updateUser(user);
      });
      
      this.schedule = {
        userId: this.userId,
        categoryId: this.categoryId,
        day: this.scheduleService.getDays(),
        address: address,
        imageURL: this.imageUrl,
        imageFullPath: this.path
      }
    //  this.addServices();

      this.error = JSON.stringify(this.schedule);
      this.scheduleService.addSchedule(this.schedule).then(data => {
        this.schedule.id = data.id;
        this.toastService.presentToast("ID : " + JSON.stringify(data));
      });

    });


  }
  deleteAllService() {
    this.serviceProvider.getServiceProviders(this.userId).subscribe(data=>{
      this.serviceProvider.deleteServiceProvider(data);
      this.addServices();
    })
   
  }

  addServices() {
    for (let d of this.scheduleService.getJobPartner()) {
      let data = {
        serviceProviderId: '',
        serviceId: d.id,
        price: d.price,
        userId: this.userId
      }
      this.serviceProvider.addServiceProvider(data);

    }
  }

  processUpdateSchedule() {
    this.location.getAddress().subscribe(address => {
      if (this.scheduleService.isJobDirty) {
       // this.deleteAllService()

      }
      if (this.scheduleService.isTimeDirty) {
        this.schedule.day = this.scheduleService.getDays();
      }

      if (this.scheduleService.isAddressDistry) {
        this.schedule.address = address
        this.authService.getUser(this.userId).subscribe(user=>{
          user.address = address;
         // user.imageURL = this.imageUrl;
         // user.imagePath = this.path;
          this.authService.updateUser(user);
        });
      }

      if (this.scheduleService.isImageURLDirty) {
        this.schedule.imageURL = this.imageUrl
        this.schedule.imageFullPath = this.path;
      }



      this.scheduleService.updateSchedule(this.schedule);

    });
  }
  async updateSchedule() {
    if (this.scheduleService.isImageURLDirty) {
      this.toastService.presentToast(this.schedule.imageFullPath);
      this.scheduleService.deleteFile(this.schedule.imageFullPath);
      this.isAdded = false;
      this.addPicture();
    } else {
      this.loading = await this.loadingCtrl.create({
        message: 'Please wait...',
        duration: 2000
      });
      await this.loading.present();
      this.processUpdateSchedule();
      this.toastService.presentToast("Success!!!");
      this.router.navigate(['dashboard']);
      this.loading.onDidDismiss();

    }


  }
  isLinear = false;
  secondFormGroup: FormGroup;


}


function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map(control => control.value)
      .reduce((prev, next) => next ? prev + next : prev, 0);

    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}