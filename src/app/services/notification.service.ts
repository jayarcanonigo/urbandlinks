import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstant } from '../config/app-contants';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private httpClient: HttpClient) { }

   

  sendNotification(message, token) {

    let notification = {
      "notification":{
        "title":"Service Booking",
        "body":message,
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "landing_page":"second",
        "price":"$3,000.00"
      },
       "to": token,
           "priority":"high",
        "restricted_package_name":""
    }

  

    this.sendPostRequest(notification).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  sendPostRequest(data: any): Observable<any> {
    console.log(AppConstant.APP_KEY);
    
    return this.httpClient.post<any>(AppConstant.FCM_URL, data,    
          {
            headers : new HttpHeaders(
              {
              'Content-Type':'application/json',
              'Authorization': AppConstant.APP_KEY
    
            }
          ) 
          
          } );
  
  }
  
  //// this.fb.logout();
  //  this.storageService.clear();
  //  this.router.navigate(['']);
}
