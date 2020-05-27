import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../cart-modal/cart-modal.page';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  @ViewChild('cart', {static: false, read: ElementRef})fab : ElementRef;
  cart = [];
  products = [];
  cartItemCount: BehaviorSubject<number>;
  constructor(private cartService: CartService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.products = this.cartService.getProducts();
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  addTochart(product){
    this.animateCSS('tada');
    this.cartService.addProduct(product);
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
