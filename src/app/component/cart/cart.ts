import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { ShoppingCartService } from '../../services/shoppingcart.service';
import { ShoppingCart } from '../../model/shoppingcart.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/userprofile.service';
import { Profile } from '../../model/userprofile.model';
import { debounceTime, Subject } from 'rxjs';
import { Loading } from '../loading/loading';
import { PaymentService } from '../../services/stripe.service';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environment/environment';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

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
  private paymentService = inject(PaymentService)
  isCheckingOut = signal(false);
  isPaymentProcessing = signal(false);
  isStripeReady = signal(false);
  paymentError = signal('');
  paymentSuccess = signal(false);
  router = inject(Router)

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  private orderService = inject(OrderService);

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
    setTimeout(() => this.initStripe(), 100)
  }

  placeOrder(){
    if (this.isPaymentProcessing()) return;

    if (!this.stripe || !this.cardElement) {
      this.paymentError.set('Card details are still loading. Please try again in a moment.');
      return;
    }

    const total = this.cart()?.total ?? 0;
    const amount = Math.round(total * 100)

    this.isPaymentProcessing.set(true);
    this.paymentError.set('');
    this.paymentSuccess.set(false);

    this.paymentService.createPaymentIntent(amount).subscribe({
      next: async (data) => {
        const result = await this.stripe!.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: this.cardElement!
          }
        })

        if(result?.paymentIntent?.status === 'succeeded'){
          this.paymentSuccess.set(true);
          this.orderService.createOrder().subscribe({
            next: (order) => {
              console.log('order was created!', order)
              this.router.navigate([`/orders`])
            },
          })
          
        } else {
          this.paymentError.set(result?.error?.message ?? 'Payment failed. Please check your card details.');
          console.error('payment failed.', result?.error)
        }
        this.isPaymentProcessing.set(false);
      }, error: (err) => {
        this.paymentError.set('Payment could not be started. Please try again.');
        this.isPaymentProcessing.set(false);
        console.log(err)
      },
    })
  }

  async initStripe(): Promise<void> {
    this.isStripeReady.set(false);
    this.paymentError.set('');
    this.paymentSuccess.set(false);

    this.stripe = this.stripe ?? await loadStripe(environment.stripePublishableKey);

    if (!this.stripe) {
      this.paymentError.set('Payment form could not be loaded.');
      return;
    }

    this.cardElement?.unmount();
    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card', {
      hidePostalCode: true,
      
      style: {
        base: {
          color: '#0f172a',
          fontFamily: '"BR Sonoma", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          iconColor: '#2563eb',
          '::placeholder': {
            color: '#94a3b8',
          },
        },
        invalid: {
          color: '#dc2626',
          iconColor: '#dc2626',
        },
      },
    });

    this.cardElement.on('change', (event) => {
      this.paymentError.set(event.error?.message ?? '');
      this.paymentSuccess.set(false);
    });

    this.cardElement.mount('#card-element')
    this.isStripeReady.set(true);
  }
  
}
