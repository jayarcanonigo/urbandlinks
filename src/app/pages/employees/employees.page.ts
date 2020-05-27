import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage implements OnInit {

  users = [];
  page = 0;
  maximumPages = 4;
  constructor(public navCtrl: NavController, private httpClient: HttpClient,
              private router: Router    
        ) {
    this.loadUsers();
   }

  ngOnInit() {
  }

  loadUsers(infiniteScroll?){
    this.httpClient.get('https://randomuser.me/api/?results=5&page=${this.page}').subscribe(res=>{
      this.users = this.users.concat(res['results']);
      console.log( this.users);
      if(infiniteScroll){
        infiniteScroll.complete();
      }
      
    });

  }

  loadMore(infiniteScroll){
    infiniteScroll.enable(false)
    //this.page++;
    //this.loadUsers(infiniteScroll);
  }

  pickEmployee(user){
    this.router.navigate(['home/employeeservice']);
    console.log(user);
    
  }

}
