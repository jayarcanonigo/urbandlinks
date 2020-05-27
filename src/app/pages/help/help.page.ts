import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  index : string = '2';
  user : {
    id: 2,
    first: 'Bob',
    last: 'Davis'
  }
  users: any[] = [
    {
      id: 1,
      first: 'Alice',
      last: 'Smith',
    },
    {
      id: 2,
      first: 'Bob',
      last: 'Davis',
    },
    {
      id: 3,
      first: 'Charlie',
      last: 'Rosenburg',
    }
  ];

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id == o2.id : o1 == o2;
  };

  compareWith = this.compareWithFn;
  constructor() {

    this.compareWithFn(this.users, this.users[2]);
   }

  ngOnInit() {
  }

}
