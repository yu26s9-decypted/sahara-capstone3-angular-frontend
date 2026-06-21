import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { ShoppingCartService } from '../../services/shoppingcart.service';
import { ShoppingCart } from '../../model/shoppingcart.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/userprofile.service';
import { Profile } from '../../model/userprofile.model';
import { debounceTime, Subject } from 'rxjs';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-cart',
  imports: [KeyValuePipe, CurrencyPipe, Loading],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart implements OnInit {
  private cartService = inject(ShoppingCartService);
  userService = inject(UserService)
  authService = inject(AuthService)
  user = signal<Profile | null>(null);
  private isCartLoading = signal(true);
  private isUserLoading = signal(true);
  isLoading = computed(() => this.isCartLoading() || this.isUserLoading());
  cart = signal<ShoppingCart | null>(null);
  private quantitySubject = new Subject<{productId: number, quantity: number}>();

  isCheckingOut = signal(false);

  deleteProductWarning = signal(false);

  isEmpty = computed(() => {
    const c = this.cart();
    return !!c && Object.keys(c.items).length === 0;
  });

  constructor() {
    this.quantitySubject.pipe(
      debounceTime(500)
    ).subscribe(({ productId, quantity }) => {
      this.cartService.incrementProductQuantity(productId, quantity).subscribe({
        next: (data) => this.cart.set(data),
        error: (err) => console.error(err)
      });
    });
  }

  ngOnInit(): void {
    this.cartService.getCartItem().subscribe({
      next: (data) => {
        this.cart.set(data);
        this.isCartLoading.set(false);
      },
      error: (err) => {
        this.cart.set({ items: {}, total: 0 });
        this.isCartLoading.set(false);
        console.error(err);
      }
    });

    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user.set(data);
        this.isUserLoading.set(false)
      }, error: (err) => {
        this.isUserLoading.set(false)
        console.error(err);
      }
    })
  }

  addQuantity(productId: number, currentQuantity: number) {
    this.cart.update(c => {
      if(!c) return c;
      c.items[productId].quantity = currentQuantity + 1
      return {...c}
    });

    this.quantitySubject.next({ productId, quantity: currentQuantity + 1 });
  }

  deleteItem(productId: number): void {
    // optimistic update
    this.cart.update(c => {
        if (!c) return c;
        const items = { ...c.items };
        delete items[productId];
        return { ...c, items };
    });
    this.cartService.cartCount.update(count => count - 1);

    this.cartService.removeCartItem(productId).subscribe({
        next: (data) => {
            this.cart.set(data);
            this.cartService.cartCount.set(Object.keys(data.items).length);
        },
        error: (err) => console.error(err)
    });
}

  removeQuantity(productId: number, currentQuantity: number) {
    if(currentQuantity <= 1){
      this.deleteItem(productId);
      return;
    }

     this.cart.update(c => {
      if(!c) return c;
      c.items[productId].quantity = currentQuantity - 1
      return {...c}
    });
    this.quantitySubject.next({ productId, quantity: currentQuantity - 1 });
  }

  checkout(){
    this.isCheckingOut.set(true);
    console.log('user is checking out')
  }
  
}
