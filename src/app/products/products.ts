import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
  private router = inject(Router)

  ngOnInit(): void {
    console.log("initialize")
    this.route.queryParamMap.subscribe(params => {
      const name = params.get('name') ?? undefined;
      this.isLoading.set(true)

      const categoryId = params.get('cat') ? Number(params.get('cat')) : undefined;

      this.productService.getAllProduct(name, categoryId).subscribe({
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

  onCategoryChange(event: Event){
    const value = (event.target as HTMLSelectElement).value;
    const categoryId = value ? Number(value) : undefined;
    console.log(value, categoryId)
    this.router.navigate(['/products'], {queryParams: {cat: categoryId}})
    
  }

  

}
