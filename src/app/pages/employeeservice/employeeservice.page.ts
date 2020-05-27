import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../cart-modal/cart-modal.page';
import { JobsService } from '../../services/jobs.service';

@Component({
  selector: 'app-employeeservice',
  templateUrl: './employeeservice.page.html',
  styleUrls: ['./employeeservice.page.scss'],
})
export class EmployeeservicePage implements OnInit {

  @ViewChild('cart', {static: false, read: ElementRef})fab : ElementRef;
  cart = [];
  jobs = [];
  jobsItemCount: BehaviorSubject<number>;
  constructor(private jobsService: JobsService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.jobs = this.jobsService.getProducts();
    this.cart = this.jobsService.getCart();
    this.jobsItemCount = this.jobsService.getServiceItemCount();
  }

  addToCart(job){
    this.animateCSS('tada');
    this.jobsService.addService(job);
  }

  async openCart(){
    this.animateCSS('bounceOutLeft', true);
    
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.onWillDismiss().then(() => {
      this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft');
      this.animateCSS('bounceInLeft')
    })
    modal.present();
  }

  animateCSS(animationName, keepAnimated = false){
      const node = this.fab.nativeElement;
      node.classList.add('animated', animationName);

      function handleAnimationEnd(){
        if(!keepAnimated){
          node.classList.remove('animated', animationName);
        }
        node.removeEventListener('animationend', handleAnimationEnd)
      }
      node.addEventListener('animationend', handleAnimationEnd)
     
  }

}
