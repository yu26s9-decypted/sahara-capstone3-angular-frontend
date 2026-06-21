import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order, OrderLineItem } from '../../model/order.model';
import { Product } from '../../model/product.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Loading } from '../loading/loading';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/userprofile.service';

@Component({
  selector: 'app-order-detail',
  imports: [CurrencyPipe, DatePipe, Loading, RouterLink],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})

export class OrderDetail implements OnInit {
  orderService = inject(OrderService)
  userService = inject(UserService)
  profile = this.userService.profile;
  orders = signal<Order[]>([])
  orderLineItems = signal<{[orderId: number]: OrderLineItem[]}> ({});
  private isOrdersLoading = signal(true);
  private isProfileLoading = signal(true);
  isLoading = computed(() => this.isOrdersLoading() || this.isProfileLoading());

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userService.profile.set(profile);
        this.isProfileLoading.set(false);
      },
      error: (err) => {
        this.isProfileLoading.set(false);
        console.error(err);
      }
    });

    this.orderService.getOrder().subscribe({
      next:(data) => {
        this.orders.set(data)
        if (data.length === 0) {
          this.isOrdersLoading.set(false);
          return;
        }

        let loadedOrders = 0;
        data.forEach(order => {
          this.orderService.getOrderItems(order.orderId).subscribe({
            next: (orderItem) => {
              this.orderLineItems.update(current  => ({
                ...current,
                [order.orderId]: orderItem
              }));
              loadedOrders++;
              if (loadedOrders === data.length) {
                this.isOrdersLoading.set(false);
              }
            },
            error: (err) => {
              console.error(err);
              loadedOrders++;
              if (loadedOrders === data.length) {
                this.isOrdersLoading.set(false);
              }
            }
          })
        })
        
      }, error: (err) => {
        this.isOrdersLoading.set(false);
        console.error(err)
      },
    })

   
  }

  itemsForOrder(orderId: number): OrderLineItem[] {
    return this.orderLineItems()[orderId] ?? [];
  }

  itemCount(orderId: number): number {
    return this.itemsForOrder(orderId).reduce((total, item) => total + item.quantity, 0);
  }

  orderTotal(order: Order): number {
    return this.itemsForOrder(order.orderId).reduce((total, item) => total + item.salesPrice, order.shippingAmount);
  }

  productSlug(product: Product): string {
    const nameSlug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return `${nameSlug}-${product.productId}`;
  }

  shipTo(order: Order): string {
    const profile = this.profile();
    const city = profile?.city || order.city;
    const state = profile?.state || order.state;
    return [city, state].filter(Boolean).join(', ') || 'Address unavailable';
  }

  deliveryAddress(order: Order): { street: string; cityStateZip: string } {
    const profile = this.profile();
    const street = profile?.address || order.address || 'Address unavailable';
    const city = profile?.city || order.city;
    const state = profile?.state || order.state;
    const zip = profile?.zip || order.zip;
    const cityState = [city, state].filter(Boolean).join(', ');
    const cityStateZip = [cityState, zip].filter(Boolean).join(' ');

    return {
      street,
      cityStateZip,
    };
  }

  
}
