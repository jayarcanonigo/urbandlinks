import { Injectable } from '@angular/core';  
import { Observable } from 'rxjs';  
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';  
import { map, take } from 'rxjs/operators';  
import { AngularFireStorage , AngularFireUploadTask } from '@angular/fire/storage';
import { Category } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categories: Observable<Category[]>;
  private todoCollection: AngularFirestoreCollection<Category>;

  constructor(private db: AngularFirestore, private afStorage: AngularFireStorage) {
    this.todoCollection = this.db.collection<Category>('categories');
    this.categories = this.todoCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.categories;

  }

  getCategory(id: string): Observable<Category> {  
    return this.todoCollection.doc<Category>(id).valueChanges().pipe(  
      take(1),  
      map(todo => {  
        todo.id = id;  
        return todo;  
      })  
    );  
  }  
  
  updateCategory(categoy: Category): Promise<void> {  
    return this.todoCollection.doc(categoy.id).update({
       name: categoy.name, 
       fullPath: categoy.fullPath,
       url: categoy.url
      });  
  }  

  uploadToStorage(information): AngularFireUploadTask {
    let newName = `${new Date().getTime()}.txt`;

    return this.afStorage.ref(`files/${newName}`).putString(information);
  }

  deleteFile(category : Category) {
    let id = category.id;
    let storagePath = category.fullPath;
    return this.afStorage.ref(storagePath).delete();
  }

  deleteCategory(category : Category){
    this.deleteFile(category);
    let id = category.id;
    this.todoCollection.doc(id).delete();
  }


  addCategory(category) {
    category.created = `${new Date().getTime()}`;
    return this.todoCollection.add(category);
  }
}

