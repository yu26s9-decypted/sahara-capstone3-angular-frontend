import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Loading } from '../component/loading/loading';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, RouterLink, Loading],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal(true);
  productService = inject(ProductService)
  private route = inject(ActivatedRoute)

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const name = params.get('name') ?? undefined;
      this.isLoading.set(true)

      this.productService.getAllProduct(name).subscribe({
        next: (data) => {
          this.products.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err);
        }
      })
    })
  }


  productSlug(product: Product): string {
  const nameSlug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${nameSlug}-${product.productId}`;
}
}
