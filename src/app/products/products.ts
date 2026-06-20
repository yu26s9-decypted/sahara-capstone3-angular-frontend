import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  imports: [],
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
}
