import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { ShoppingCartService } from '../../services/shoppingcart.service';
import { ShoppingCart } from '../../model/shoppingcart.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/userprofile.service';
import { Profile } from '../../model/userprofile.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [KeyValuePipe, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart implements OnInit {
  private cartService = inject(ShoppingCartService);
  userService = inject(UserService)
  authService = inject(AuthService)
  user = signal<Profile | null>(null);
  isLoading = signal(true)
  cart = signal<ShoppingCart | null>(null);
  private quantitySubject = new Subject<{productId: number, quantity: number}>();

  isEmpty = computed(() => {
    const c = this.cart();
    return !c || Object.keys(c.items).length === 0;
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
      next: (data) => this.cart.set(data),
      error: (err) => console.error(err)
    });

    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user.set(data);
        this.isLoading.set(false)
      }, error: (err) => {
        this.isLoading.set(false)
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

  removeQuantity(productId: number, currentQuantity: number) {
     this.cart.update(c => {
      if(!c) return c;
      c.items[productId].quantity = currentQuantity - 1
      return {...c}
    });
    this.quantitySubject.next({ productId, quantity: currentQuantity - 1 });
  }
}