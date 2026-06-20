import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products = signal<Product[]>([]);
  productService = inject(ProductService)

  ngOnInit(): void {
    this.productService.getAllProduct().subscribe(
      data => {
        this.products.set(data);
      }
    )
  }

  productSlug(product: Product): string {
  const nameSlug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${nameSlug}-${product.productId}`;
}
}
