import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Loading } from '../component/loading/loading';
import { min, take } from 'rxjs';

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
  minPrice = signal<number | undefined>(undefined)
  maxPrice = signal<number | undefined>(undefined)

  ngOnInit(): void {
    console.log("initialize")
    this.route.queryParamMap.subscribe(params => {
      this.isLoading.set(true)

      const name = params.get('name') ?? undefined;
      const categoryId = params.get('cat') ? Number(params.get('cat')) : undefined;
      const maxPrice = params.get('maxPrice') ? Number(params.get('minPrice')) : undefined
      const minPrice = params.get('minPrice') ? Number(params.get('minPrice')) : undefined

      this.productService.getAllProduct(name, categoryId, minPrice, maxPrice).subscribe({
        next: (data) => {
          console.log(data)
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
    this.route.queryParamMap.pipe(take(1)).subscribe(current => {
        this.router.navigate(['/products'], {queryParams: {...current, cat: categoryId}})
    })
   
    
  }

  onMinPriceChange(event: Event){
    const value = (event.target as HTMLInputElement).value;
    this.minPrice.set(value ? Number(value) : undefined);
    this.applyPriceChange()
  }

  onMaxPriceChange(event: Event){
    const value = (event.target as HTMLInputElement).value
    this.maxPrice.set(value ? Number(value) : undefined);
    this.applyPriceChange()
  }

  applyPriceChange(){
    this.route.queryParamMap.pipe(take(1)).subscribe(current => {
      this.router.navigate(['/products'], {
        queryParams: {
          ...current,
          minPrice: this.minPrice() ?? null,
          maxPrice: this.maxPrice() ?? null
        }
      })
    })
  }

  

}
