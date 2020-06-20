import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map, take, first, shareReplay } from 'rxjs/operators';
import { RequestProvider } from '../model/model';
import * as firebase from 'firebase';
import { convertSnaps } from '../shared/db-utils';
import { docJoin } from '../shared/docJoin';
@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private requestProviders: Observable<RequestProvider[]>;
  private requestProviderCollection: AngularFirestoreCollection<RequestProvider>;

  constructor(private db: AngularFirestore) {
    this.requestProviderCollection = this.db.collection<RequestProvider>('RequestProviders');
    this.requestProviders = this.requestProviderCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getRequestProviderByUserIdStatus(userId, status): Observable<RequestProvider[]> {
    return this.db.collection('RequestProviders',
      ref => ref.where('userId', '==', `${userId}`).where('status', '==', `${status}`))
      .snapshotChanges()
      .pipe(
        map(snaps => convertSnaps<RequestProvider>(snaps),
          first()
        ));
  }
  getRequestProviderByUserId(userId): Observable<RequestProvider[]> {
    return this.db.collection('RequestProviders',
      ref => ref.where('userId', '==', `${userId}`))
      .snapshotChanges()
      .pipe(
        map(snaps => convertSnaps<RequestProvider>(snaps),
          first()
        ));
  }

  getRequestProviders(): Observable<RequestProvider[]> {
    return this.requestProviders;
  }

  getRequestProvider(id: string) {
    return this.db.doc(`RequestProviders/${id}`)
      .valueChanges()
      .pipe(
        docJoin(this.db, { userId: 'Partner' }),
        shareReplay(1)
      );

  }

  addRequestProvider(requestProvider: RequestProvider): Promise<DocumentReference> {
    console.log(firebase.firestore.Timestamp.now().toDate());

    requestProvider.requestId = this.db.createId();

    return this.requestProviderCollection.add(requestProvider);
  }

  updateRequestProvider(requestProvider): Promise<void> {
    return this.requestProviderCollection.doc(requestProvider.requestId).set({
      requestId: requestProvider.requestId,
      price: requestProvider.price,
      address: requestProvider.address,
      serviceId: requestProvider.serviceId,
      serviceName: requestProvider.serviceName,
      partnerId: requestProvider.partnerId,
      date: requestProvider.date,
      serviceDate: requestProvider.serviceDate,
      time: requestProvider.time,
      status: requestProvider.status,
      quantity: requestProvider.quantity,
      userId: requestProvider.userId.userId
    }
    );
  }

  deleteRequestProvider(id: string): Promise<void> {
    return this.requestProviderCollection.doc(id).delete();
  }

}
