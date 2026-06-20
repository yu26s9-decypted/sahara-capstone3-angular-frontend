import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product.model';

@Component({
  selector: 'app-productdetail',
  imports: [CurrencyPipe],
  templateUrl: './productdetail.html',
  styleUrl: './productdetail.css',
})
export class ProductDetail implements OnInit {
  isLoading = signal(true);
  private route = inject(ActivatedRoute)
  private productService = inject(ProductService)
  product = signal<Product | null >(null);

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
