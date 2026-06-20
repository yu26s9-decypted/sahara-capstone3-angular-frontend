import { Routes } from '@angular/router';
import { Products } from './products/products';
import { ProductDetail } from './productdetail/productdetail';
import { SignIn } from './auth/sign-in/sign-in';

export const routes: Routes = [
    { path: '', component: Products },
    { path: 'product/:slug', component: ProductDetail },
    { path: 'sign-in', component: SignIn}
];
