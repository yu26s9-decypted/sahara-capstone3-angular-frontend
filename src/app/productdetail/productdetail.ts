import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product.model';
import { ShoppingCartService } from '../services/shoppingcart.service';
import { Loading } from '../component/loading/loading';

@Component({
  selector: 'app-productdetail',
  imports: [CurrencyPipe, Loading],
  templateUrl: './productdetail.html',
  styleUrl: './productdetail.css',
})
export class ProductDetail implements OnInit {
  isLoading = signal(true);
  private route = inject(ActivatedRoute)
  private productService = inject(ProductService)
  private cartService = inject(ShoppingCartService)
  product = signal<Product | null >(null);


  addItemToCart(){
    const id = this.product()?.productId;

    if(id){
      this.cartService.cartCount.update(count => count + 1)
      this.cartService.addProductToCart(id).subscribe({
        next: (data) => console.log('added item to cart', data),
        error: (err) => {
          console.log(err)
           this.cartService.cartCount.update(count => count - 1)
        }
      })
    }
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')
    const productId = Number(slug?.split('-').pop())

    this.productService.getProductById(productId).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false)
      }, error: (err) => {
        console.error(err);
        this.isLoading.set(false)
      }
    })
  }

  
  
}
