import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { User } from '../model/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users: Observable<User[]>;
  private istrue: boolean;
  private todoCollection: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.todoCollection = this.db.collection<User>('Partner');
    this.users = this.todoCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.users;
  }

  getUser(phoneNumber: string): Observable<User> {
    return this.todoCollection.doc<User>(phoneNumber).valueChanges().pipe(
      take(1),
      map(user => {
        return user;
      })
    );
  }

  addUser(user: User): Promise<void> {
    if(!this.checkUserExists(user)){
    return this.todoCollection.doc(user.phoneNumber).set({
      lastName: user.lastName,
      firstName: user.firstName,
      password: user.password,
      phoneNumber: user.phoneNumber
    });
  }
  }

  checkUserExists(data: User): Boolean {
    this.getUser(data.phoneNumber).subscribe(user=>{
      console.log("Exists : ",user);
      
      if(user){
        console.log("false");
        
        return true;
      }else{
        console.log("true");
        return false;
      }
    });   
    return false;
  }



  updateUser(user: User): Promise<void> {
    return this.todoCollection.doc(user.phoneNumber).set({
      lastName: user.lastName,
      firstName: user.firstName,
      password: user.password,
      phoneNumber: user.phoneNumber
    });
  }

  deleteUser(phoneNumber: string): Promise<void> {
    return this.todoCollection.doc(phoneNumber).delete();
  }

  login(phoneNumber: string, password: string): boolean {
   
    this.getUser(phoneNumber).subscribe(user=>{
      console.log("Exists : ",user);      
      if(user){     
        if(user.password == password){
          console.log("true");
          
          this.istrue = true;
        }  else{
          this.istrue = false;
        }      
      
      }else{
        this.istrue = false;
      }
    });   
    console.log('login '+this.istrue);
    
   return this.istrue ;
  }
}
