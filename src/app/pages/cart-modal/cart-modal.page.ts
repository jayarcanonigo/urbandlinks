import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { JobsService } from '../../services/jobs.service';
import { Job } from '../../model/model';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {

  cart  : Job[] = [];

  constructor(private jobsService: JobsService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.cart = this.jobsService.getCart();
  }

  increaseCartItem(jobs){
    this.jobsService.addService(jobs);
  }

  decreaseCartItem(jobs){
    this.jobsService.decreasService(jobs);
  }

  removeCartItem(jobs){
    this.jobsService.removeService(jobs);
  }

  getTotal(){
    return this.cart.reduce((i,j)=> i + j.price * j.quantity, 0);
  }

  close(){
    this.modalCtrl.dismiss();
  }

  checkout(){
    
  }

}
