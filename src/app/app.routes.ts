import { Routes } from '@angular/router';
import { Products } from './products/products';
import { ProductDetail } from './productdetail/productdetail';

export const routes: Routes = [
    { path: '', component: Products },
    { path: 'product/:slug', component: ProductDetail }
];
