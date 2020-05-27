import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; 
import { Observable } from 'rxjs';  
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';  
import { map, take } from 'rxjs/operators';  
import { AngularFireStorage , AngularFireUploadTask } from '@angular/fire/storage';
import { Job } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  data: Job[] = [
    {id: '0', name: 'Massage', price: 500, minimunPrice: 500, quantity: 1, categoryId : "", createdDate: ""},
    {id: '1', name: 'Hair Cut', price: 200, minimunPrice: 500, quantity: 1, categoryId : "", createdDate: ""},
    {id: '2', name: 'Hair Color', price: 300, minimunPrice: 500, quantity: 1, categoryId : "", createdDate: ""},
    {id: '3', name: 'Hair Wax', price: 600, minimunPrice: 500, quantity: 1, categoryId : "", createdDate: ""}

  ];

  private job = [];
  private serviceCount = new BehaviorSubject(0);
  private jobs: Observable<Job[]>;
  private jobCollection: AngularFirestoreCollection<Job>;

  constructor(private db: AngularFirestore, private afStorage: AngularFireStorage) {
    this.jobCollection = this.db.collection<Job>('services');

    
    this.jobs = this.jobCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getJobs(categoryId): Observable<Job[]> {  
    this.jobCollection = this.db.collection('services', ref => ref.where('categoryId', '==', `${categoryId}`));
   
    this.jobs = this.jobCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => { 
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    return this.jobs;
  }
  

  getJob(id: string): Observable<Job> {  
    return this.jobCollection.doc<Job>(id).valueChanges().pipe(  
      take(1),  
      map(job => {  
        job.id = id;  
        return job;  
      })  
    );  
  }  
  
  updateJob(job: Job): Promise<void> {  
    return this.jobCollection.doc(job.id).update({
       name: job.name,
       price: job.price,
       minimunPrice: job.minimunPrice,
       quantity: job.quantity,
       categoryId: job.categoryId
      });  
  }  

 

 
  deleteJob(job : Job){
    let id = job.id; 
    this.jobCollection.doc(id).delete();
  }


  addJob(job: Job) {
    job.createdDate = `${new Date().getTime()}`;
    return this.jobCollection.add(job);
  }


  getProducts(){
    return this.data;
  }

  getCart(){
    return this.job;
  }

  getServiceItemCount(){
    return this.serviceCount;
  }

  addService(job){
    let added = false;
    for(let p of this.job){
      if(p.id === job.id){
        p.quantity += 1;
        added = true;
        break;
      }
    }
    if(!added){
      this.job.push(job);
    }
    this.serviceCount.next(this.serviceCount.value + 1);
  }

  decreasService(job){
  
    for(let [index, p] of this.job.entries()){
      if(p.id === job.id){
        p.quantity -= 1;      
         if(p.quantity == 0){
           this.job.splice(index, 1);
         }
      }
    }    
    this.serviceCount.next(this.serviceCount.value - 1);
  }

  removeService(job){
       
    for(let [index, p] of this.job.entries()){      
      if(p.id === job.id){
        this.serviceCount.next(this.serviceCount.value - p.quantity);
        this.job.splice(index, 1);
      }
     
    }  
  }
}
