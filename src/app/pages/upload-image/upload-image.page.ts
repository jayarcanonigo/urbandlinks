
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { map, take, finalize, buffer } from 'rxjs/operators';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Capacitor } from '@capacitor/core';
import * as firebase from 'firebase';
import { Category } from '../../model/model';
import { CategoriesService } from '../../services/categories.service';



@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.page.html',
  styleUrls: ['./upload-image.page.scss'],
})
export class UploadImagePage {
  category : Category = {
    name: "",
    url: "",
    fullPath: "",
    created: ""
  };
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  currentImage: string;
  public files: Observable<Category[]>;
  loading : any;

  constructor(public navCtrl: NavController, private dataProvider: CategoriesService, private alertCtrl: AlertController,
    private toastCtrl: ToastService, private iab: InAppBrowser, private afStorage: AngularFireStorage,
    private camera: Camera, public loadingCtrl: LoadingController,
    private fileChooser: FileChooser, private file: File, private filePath: FilePath) {
    this.files = this.dataProvider.getCategories();
  }
  ngOnInit() {
  }
   /*upload(event) {
     const id = Math.random().toString(36).substring(2);
     this.ref = this.afStorage.ref(id);
     this.task = this.ref.put(event.target.files[0]);
      this.task.snapshotChanges().pipe(
       finalize(() => {
         this.ref.getDownloadURL().subscribe(url => {
           this.currentImage =  url;
           console.log(url); // <-- do what ever you want with the url..
         });
       })
     ).subscribe();
     this.uploadProgress = this.task.percentageChanges();
     console.log(this.uploadProgress);
     
     //this.downloadURL = this.task.downloadURL();
   }*/

  async addFile() {
    let inputAlert = await this.alertCtrl.create({
      subHeader: 'Store new information',
      inputs: [
        {
          name: 'info',
          placeholder: 'Lorem ipsum dolor...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Store',
          handler: data => {
            console.log(data);

            this.uploadInformation(data.info);
          }
        }
      ]
    });
    await inputAlert.present();
  }

  uploadInformation(text) {
    let upload = this.dataProvider.uploadToStorage(text);

    // Perhaps this syntax might change, it's no error here!


  }

  deleteFile(file) {
    this.dataProvider.deleteFile(file).subscribe(() => {
      this.toastCtrl.presentToast('New File added!')
    });
  }

  viewFile(url) {
    this.iab.create(url);
  }

 async openGallery() {      
    this.fileChooser.open().then((uri) => {
        this.filePath.resolveNativePath(uri).then((resolvedNativepath)=>{  
          this.transformarDataUrl(resolvedNativepath)        
         //  let fileName = resolvedNativepath.substring(resolvedNativepath.lastIndexOf("/") + 1); 
          //  let path =  resolvedNativepath.substr(0, resolvedNativepath.lastIndexOf('/') + 1);       
          //   this.file.readAsArrayBuffer(path, fileName).then(async (buffer) => {
          //  // await this.upload(buffer, fileName);
          // }).catch(error =>{
          
          // })
        })

    })
  }

  async transformarDataUrl(uri)
  {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    await this.loading.present();
    let fileName = uri.substring(uri.lastIndexOf("/") + 1); 
    let path =  uri.substr(0, uri.lastIndexOf('/') + 1);   
    this.file.readAsDataURL(path, fileName).then(dataurl => {
      this.toastCtrl.presentToast("Show");
      this.currentImage = dataurl;
      this.loading.onDidDismiss();
    },
  (error) =>{
    
    this.toastCtrl.presentToast(error.message);
  });
  }

  async upload(buffer, name) {  
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    await this.loading.present();
    let blob = new Blob([buffer], { type: "image/jpg" });
    //this.currentImage = blob;
     this.ref = this.afStorage.ref(name);
     this.task = this.ref.put(blob)
      this.task.snapshotChanges().pipe(
       finalize(() => {
         this.ref.getDownloadURL().subscribe(url => {
           this.category.url = url;         
           this.dataProvider.addCategory(this.category);
            this.loading.onDidDismiss();
            this.toastCtrl.presentToast("Finish Download");
           console.log(url); // <-- do what ever you want with the url..
         });
       })
     ).subscribe();


  }
  
}


  /*this.camera.getPicture(options).then((imageData) => {
    this.currentImage = 'data:image/jpeg;base64,' + imageData;
     loading.onDidDismiss();
  }, (err) => {
    // Handle error
    console.log("Camera issue:" + err);
  });*/




