import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestProvider } from '../../model/model';
import { RequestService } from '../../services/request.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.page.html',
  styleUrls: ['./request-list.page.scss'],
})
export class RequestListPage implements OnInit {
  pendingList: Observable<RequestProvider[]>;
  pending : RequestProvider[];
  title: string;

  constructor(private requestService: RequestService, private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    const status = this.route.snapshot.paramMap.get('status');
    this.title = status;
    console.log(status);
    
     this.requestService.getRequestProviderByUserIdStatus('4yIkFf95iR7E76Yx7dFN', status).subscribe(
    data=>{
      this.pending = data;
      console.log(data);
      
    })
      ;

  }

}
