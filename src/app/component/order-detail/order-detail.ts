import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order, OrderLineItem } from '../../model/order.model';

@Component({
  selector: 'app-order-detail',
  imports: [],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})

export class OrderDetail implements OnInit {
  orderService = inject(OrderService)
  orders = signal<Order[]>([])
  orderLineItems = signal<{[orderId: number]: OrderLineItem[]}> ({});

  ngOnInit(): void {
    this.orderService.getOrder().subscribe({
      next:(data) => {
        console.log(data)
        this.orders.set(data)
        data.forEach(order => {
          this.orderService.getOrderItems(order.orderId).subscribe({
            next: (orderItem) => {
              this.orderLineItems.update(current  => ({
                ...current,
                [order.orderId]: orderItem
              }));
            },
          })
        })
        
      }, error(err) {
        console.error(err)
      },
    })

   
  }

  
}
