
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { map, take, finalize, buffer } from 'rxjs/operators';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component, OnInit } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../model/model';
import { CategoriesService } from '../../services/categories.service';



@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  category: Category = {
    name: "",
    url: "",
    fullPath: "",
    created: "",

  };
  isAdded: Boolean = true;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  currentImage: string;
  public files: Observable<Category[]>;
  loading: any;
  path: string;

  constructor(public navCtrl: NavController, private dataProvider: CategoriesService, private alertCtrl: AlertController,
    private toastCtrl: ToastService, private iab: InAppBrowser, private afStorage: AngularFireStorage,
    private camera: Camera, public loadingCtrl: LoadingController,
    private fileChooser: FileChooser, private file: File, private filePath: FilePath,
    private router: Router, private activatedRoute: ActivatedRoute
  ) {

  }
  ngOnInit() {
  }

  ionViewWillEnter() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.dataProvider.getCategory(id).subscribe(category => {
        this.category = category;
      });
    }
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

  deleteCaterory(category) {
    console.log(category);

    this.dataProvider.deleteFile(category).subscribe(() => {
      this.toastCtrl.presentToast('New Category Deleted!')
      this.router.navigate(['home/categorylist']);
    });
  }

  viewFile(url) {
    this.iab.create(url);
  }

  async openGallery() {
    this.fileChooser.open().then((uri) => {
      this.filePath.resolveNativePath(uri).then((resolvedNativepath) => {
        this.path = resolvedNativepath;
        this.transformarDataUrl(resolvedNativepath);

      })

    })
  }

  async transformarDataUrl(uri) {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    await this.loading.present();
    let fileName = uri.substring(uri.lastIndexOf("/") + 1);
    let path = uri.substr(0, uri.lastIndexOf('/') + 1);
    
    this.file.readAsDataURL(path, fileName).then(dataurl => {      
      this.category.url = dataurl;
      this.loading.onDidDismiss();
    },
      (error) => {
        this.toastCtrl.presentToast(error.message);
      });
  }

  async upload(buffer, name) {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    await this.loading.present();
    let type = name.substr(0, name.lastIndexOf('.') + 1);
    let blob = new Blob([buffer], { type: `image/${type}` });
    this.ref = this.afStorage.ref(`files/${name}`);

    this.task = this.ref.put(blob)

    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.category.url = url;
          this.category.fullPath = `files/${name}`
          if (this.isAdded) {
            this.dataProvider.addCategory(this.category);
          } else {
            this.dataProvider.updateCategory(this.category);
          }
          this.loading.onDidDismiss();
          this.toastCtrl.presentToast("Success!!!");
          this.router.navigate(['home/categorylist']);
          console.log(url); // <-- do what ever you want with the url..
        });
      })
    ).subscribe();


  }
  addCategory() {
    let fileName = this.path.substring(this.path.lastIndexOf("/") + 1);
    let path = this.path.substr(0, this.path.lastIndexOf('/') + 1);
    this.file.readAsArrayBuffer(path, fileName).then(async (buffer) => {
      await this.upload(buffer, fileName);
    }).catch(error => {
    })
  }

  async updateCategeory(category: Category) {
    this.isAdded = false;

    if (this.path) {
      this.dataProvider.deleteFile(category);
      let fileName = this.path.substring(this.path.lastIndexOf("/") + 1);
      let path = this.path.substr(0, this.path.lastIndexOf('/') + 1);
      this.file.readAsArrayBuffer(path, fileName).then(async (buffer) => {
        await this.upload(buffer, fileName);
      }).catch(error => {
      })
    } else {
      this.loading = await this.loadingCtrl.create({
        message: 'Please wait...',
        duration: 2000
      });
      await this.loading.present();
      this.dataProvider.updateCategory(category);
      this.toastCtrl.presentToast("Success!!!");
      this.router.navigate(['home/categorylist']);
      this.loading.onDidDismiss();
    }
  }

}


  /*this.camera.getPicture(options).then((imageData) => {
    this.currentImage = 'data:image/jpeg;base64,' + imageData;
     loading.onDidDismiss();
  }, (err) => {
    // Handle error
    console.log("Camera issue:" + err);
  });*/




