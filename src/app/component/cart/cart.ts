import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ShoppingCartService } from '../../services/shoppingcart.service';
import { ShoppingCart, ShoppingCartItem } from '../../model/shoppingcart.model';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [KeyValuePipe, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit{
objectValues(items: { [productId: number]: ShoppingCartItem; }|undefined) {
throw new Error('Method not implemented.');
}
  cart = signal<ShoppingCart | null>(null)
  private cartService = inject(ShoppingCartService)

  ngOnInit(): void {
    this.cartService.getCartItem().subscribe({
      next: (data) => this.cart.set(data),
      error: (err) => console.error(err)
    })
  }

  isEmpty = computed(() => {
    const c = this.cart();
    return !c || Object.keys(c.items).length === 0;
});
  
}
