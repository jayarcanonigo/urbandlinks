import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule, User } from '../../model/model';
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
  phoneNumber: string;
  isAdded: boolean = true;
  isTest = false;
  loading: any;
  path: string;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  jobCount: Observable<number>;

  days = [];
  constructor(private activatedRoute: ActivatedRoute, private storage: StorageService,
    private scheduleService: ScheduleService, private fb: FormBuilder,
    private location: LocationService, private router: Router, private toastService: ToastService,
    public loadingCtrl: LoadingController, private afStorage: AngularFireStorage,
    private file: File

  ) {
    this.initDirty();
  }

  ngOnInit() {

  
    this.activatedRoute.data.subscribe(data => {
      this.schedule = data.data ;
      
      });
    console.log( "Data from resolver: ", this.activatedRoute.snapshot.data  );
  
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
    this.jobCount = this.scheduleService.getDaysCount();
    this.storage.get(AuthConstants.AUTH).then(res => {
      if (id) {
        this.categoryId = id;
        console.log(res.phoneNumber );
        
        this.phoneNumber = res.phoneNumber + "";
        this.scheduleService.getScheduleByCategoryAndUserId(id, res.phoneNumber + '').subscribe(schedule => {
          this.schedule = schedule;
          this.days = ['Mon', 'Tue', 'Wen', 'Thur', 'Fri', 'Sat', 'Sun'];
        });
      }
    });

  }

  initDirty() {
    this.scheduleService.isAddressDistry = false;
    this.scheduleService.isTimeDirty = false;
    this.scheduleService.isJobDirty = false;
    this.scheduleService.isImageURLDirty = false;

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
          this.scheduleService.imageUrl = url;
          this.scheduleService.imageFullPath = `partner/${name}`

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
  async addPicture() {
    let fileName = `${new Date().getTime()}`;
    await this.upload(this.scheduleService.imageUrl, fileName);

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
    this.location.getAddress().subscribe(address => {
      this.schedule = {
        userId: this.phoneNumber,
        categoryId: this.categoryId,
        day: this.scheduleService.getDays(),
        job: this.scheduleService.getJobPartner(),
        address: address,
        imageURL: this.scheduleService.imageUrl,
        imageFullPath: this.scheduleService.imageFullPath
      }
      this.scheduleService.addSchedule(this.schedule).then(data => {
        this.schedule.id = data.id;
      });
    
    })
  }

  processUpdateSchedule() {
    this.location.getAddress().subscribe(address => {
      if (this.scheduleService.isJobDirty) {
        this.schedule.job = this.scheduleService.getJobPartner();
      }
      if (this.scheduleService.isTimeDirty) {
        this.schedule.day = this.scheduleService.getDays();
      }

      if (this.scheduleService.isAddressDistry) {
        this.schedule.address = address
      }

      if (this.scheduleService.isImageURLDirty) {
        this.schedule.imageURL = this.scheduleService.imageUrl
        this.schedule.imageFullPath = this.scheduleService.imageFullPath
      }



      this.scheduleService.updateSchedule(this.schedule);
    
    });
  }
  async updateSchedule() {
    if (this.scheduleService.isImageURLDirty) {
      this.scheduleService.deleteFile(this.scheduleService.imageFullPath);
      this.schedule.imageURL = this.scheduleService.imageUrl
      this.schedule.imageFullPath = this.scheduleService.imageFullPath
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