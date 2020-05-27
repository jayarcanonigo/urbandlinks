import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as querystring from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }
  
  post(servicename: string, data:any){
    const headers = new HttpHeaders();
    const options = {header: headers, withCredentials: false};
    const url = environment.apiUrl + servicename;

    return this.http.post(url, JSON.stringify(data), options);
  }

  get(servicename: string, data:any){   
        
    const url = `${environment.apiUrl + servicename}?${querystring.stringify(data)}`;
    return this.http.get(`https://wsint.advisen.com/cybermetrix/authenticate?user_name=jplaras&pwd=test%40123`);
  }
}
