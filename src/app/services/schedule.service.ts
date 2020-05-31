import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map, take, first } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Schedule, TimeSchedule } from '../model/model';
import { convertSnaps } from '../shared/db-utils';



@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  public isTimeDirty = false;
  public isJobDirty = false;
  public isImageURLDirty = false;
  public isAddressDistry = false;
  private _imageUrl: string;
  private _imageFullPath: string;  
  private schedule: Observable<Schedule>;
  private daystime = [];
  private daytime: TimeSchedule = {
    id: "",
    name: ""
  };
  private jobPartner = [];

  public timeSchedule: Schedule;
  private scheduleCount = new BehaviorSubject(0);
  private daysCount = new BehaviorSubject(0);
  private schedules: Observable<Schedule[]>;
  private scheduleCollection: AngularFirestoreCollection<Schedule>;

  constructor(private db: AngularFirestore, private afStorage: AngularFireStorage) {
    this.scheduleCollection = this.db.collection<Schedule>('schedule');
    this.schedules = this.scheduleCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getSchedules(categoryId, userId): Observable<Schedule[]> {
    this.scheduleCollection = this.db.collection('schedule', ref =>
      ref.where('categoryId', '==', `${categoryId}`).where('userId', '==', `${userId}`));

    this.schedules = this.scheduleCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    return this.schedules;
  }

  getSchedule(): Observable<Schedule> {
    return this.schedule;
  }



  getScheduleByCategoryAndUserId(categoryId, userId): Observable<Schedule> {
    this.schedule = this.db.collection('schedule',
      ref => ref.where('categoryId', '==', `${categoryId}`).where('userId', '==', `${userId}`))
      .snapshotChanges()
      .pipe(
        map(snaps => {
          const schedule = convertSnaps<Schedule>(snaps);

          return schedule.length == 1 ? schedule[0] : undefined;
        }),
        first()
      );

    return this.schedule;
  }


  updateSchedule(schedule: Schedule): Promise<void> {
    return this.scheduleCollection.doc(schedule.id).update({
      day: schedule.day,
      job: schedule.job,
      address: schedule.address,
      imageURL: schedule.imageURL,
      imageFullPath:  schedule.imageFullPath
    });
  }




  deleteSchedule(schedule: Schedule) {
    let id = schedule.id;
    this.scheduleCollection.doc(id).delete();
  }


  addSchedule(schedule: Schedule) {
    return this.scheduleCollection.add(schedule);
  }

  removeDayTime(day): void {
    this.daystime = this.daystime.filter(h => h.name !== day);
  }

  getDays() {
    return this.daystime;
  }

  setDays(days) {
    return this.daystime = days;
  }

  getDaysCount(){
     this.daysCount.next(this.jobPartner.length);
     return this.daysCount;
  }

  setJobPartner(jobs){
    this.jobPartner = [];
    for(let job of jobs){
      if(job.isSelected){
        this.jobPartner.push(
          {
            id : job.id,
            name: job.name,
            price: job.price
          }
        )
      }
    }
    
    
  }
  
  getJobPartner(){
      return this.jobPartner;
  }
  updateDay(day: string, timelist) {

    this.removeDayTime(day);
    for (let p of timelist) {
      let data = {
        id: p.name,
        name: day
      };
      if (p.isSelected) {
        this.daystime.push(data);
      }

    }

    console.log(this.daystime);
    /* 
     let add = true;
    
       for (let [index, d] of this.daystime.entries()) {
         if (d.id === time) {
           this.timeSchedule.mon.splice(index, 1);
           add = false;
           break;
         }
       }
     
     if (add) {
       console.log(time);
       
       
     //  this.timeSchedule.mon.push(time);
     }
       console.log(time);
 
     console.log( this.timeSchedule); 
  */



  }
  public get imageUrl(): string {
    return this._imageUrl;
  }
  public set imageUrl(value: string) {
    this._imageUrl = value;
  }

  public get imageFullPath(): string {
    return this._imageFullPath;
  }
  public set imageFullPath(value: string) {
    this._imageFullPath = value;
  }

}
