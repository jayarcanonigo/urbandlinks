import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map, take, first } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { convertSnaps } from '../shared/db-utils';
import { ToastService } from './toast.service';
import { ServiceProvider } from '../model/model';
@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {
  private serviceProvider: Observable<ServiceProvider[]>;
  private serviceProviderCollection: AngularFirestoreCollection<ServiceProvider>;
  constructor(private db: AngularFirestore, private afStorage: AngularFireStorage, private toastService: ToastService) {
    this.serviceProviderCollection = this.db.collection<ServiceProvider>('serviceProvider');
    this.serviceProvider = this.serviceProviderCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getServiceProvider(categoryId, userId): Observable<ServiceProvider[]> {
    this.serviceProviderCollection = this.db.collection('serviceProvider', ref =>
      ref.where('categoryId', '==', `${categoryId}`).where('userId', '==', `${userId}`));

    this.serviceProvider = this.serviceProviderCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    return this.serviceProvider;
  }

  addServiceProvider(serviceProvider: ServiceProvider) {
    this.serviceProviderCollection = this.db.collection<ServiceProvider>('serviceProvider');

    serviceProvider.serviceProviderId = this.db.createId();
    console.log('add', serviceProvider);

    return this.serviceProviderCollection.doc(serviceProvider.serviceProviderId).set(serviceProvider).then(() => { 
      console.log('success!, Add Service'); 
  }) 
  .catch(err => { 
      console.log('errorcode Service', err.code); 
  });;
  }



  deleteServiceProvider(service): number {
      this.serviceProviderCollection = this.db.collection<ServiceProvider>('serviceProvider');
    let count = 0;

      console.log( ' length   ' , service.length);
      if (service.length > 0 ) {
        count = service.length;
     
        
        for (let d of service) {
         
          this.serviceProviderCollection.doc(d.id).delete().then(() => { 
            console.log('success!, show alert now'); 
        }) 
        .catch(err => { 
            console.log('errorcode', err.code); 
        });
        }
      }
      
 

    return count;

  }


  getServiceProviders(userId): Observable<ServiceProvider[]> {
    this.serviceProviderCollection = this.db.collection('serviceProvider', ref =>
      ref.where('userId', '==', `${userId}`));

    this.serviceProvider = this.serviceProviderCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    return this.serviceProvider;
  }
}
