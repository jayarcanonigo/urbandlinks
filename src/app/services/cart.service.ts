import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product{
  id: number;
  name: string;
  price: number;
  quantity: number;
}
@Injectable({
  providedIn: 'root'
})

export class CartService {
  data: Product[] = [
    {id: 0, name: 'Sugar', price: 20, quantity: 1},
    {id: 1, name: 'Vinegar', price: 15, quantity: 1},
    {id: 2, name: 'Rice', price: 45, quantity: 1},
    {id: 3, name: 'Oil', price: 20, quantity: 1}

  ];

  private cart = [];
  private cartItemCount = new BehaviorSubject(0);
  constructor() { }

  getProducts(){
    return this.data;
  }

  getCart(){
    return this.cart;
  }

  getCartItemCount(){
    return this.cartItemCount;
  }

  addProduct(product){
    let added = false;
    for(let p of this.cart){
      if(p.id === product.id){
        p.quantity += 1;
        added = true;
        break;
      }
    }
    if(!added){
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);
  }

  decreaseProduct(product){
  
    for(let [index, p] of this.cart.entries()){
      if(p.id === product.id){
        p.quantity -= 1;      
         if(p.quantity == 0){
           this.cart.splice(index, 1);
         }
      }
    }    
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }

  removeProduct(product){
       
    for(let [index, p] of this.cart.entries()){      
      if(p.id === product.id){
        this.cartItemCount.next(this.cartItemCount.value - p.quantity);
        this.cart.splice(index, 1);
      }
     
    }  
    console.log("", this.cart);
  }
}
