import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SampleDirective } from './directives/sample.directive';
import { HttpClientModule } from '@angular/common/http';
import { CartModalPageModule } from './pages/cart-modal/cart-modal.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Camera } from '@ionic-native/camera/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import {  File } from '@ionic-native/file/ngx';
import {  FilePath } from '@ionic-native/file-path/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';


firebase.initializeApp(environment.firebaseConfig);
@NgModule({
  declarations: [AppComponent, SampleDirective],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, CartModalPageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, AngularFireDatabaseModule, BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [    
    StatusBar,
    SplashScreen,
    HttpClientModule,
    AngularFireAuth,
    AngularFireStorage,
    FileChooser,
    FilePath,
    File,
    Camera,
    ImagePicker,
    MediaCapture,  
    Media,
    StreamingMedia,
    PhotoViewer,
    InAppBrowser,
    {
      provide: RouteReuseStrategy, useClass: IonicRouteStrategy
    },
    { provide: SETTINGS, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
