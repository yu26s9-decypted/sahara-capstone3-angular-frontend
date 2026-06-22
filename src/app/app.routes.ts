import { Routes } from '@angular/router';
import { Products } from './products/products';
import { ProductDetail } from './productdetail/productdetail';
import { SignIn } from './auth/sign-in/sign-in';
import { ConditionsOfUse } from './legal/conditions-of-use/conditions-of-use';
import { PrivacyNotice } from './legal/privacy-notice/privacy-notice';
import { AccountDetail } from './component/account-detail/account-detail';
import { Cart } from './component/cart/cart';
import { OrderDetail } from './component/order-detail/order-detail';
import { CreateAccount } from './auth/create-account/create-account';
import { Oasis } from './component/oasis/oasis';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', component: Products },
    { path: 'product/:slug', component: ProductDetail },
    { path: 'sign-in', component: SignIn},
    { path: 'conditions-of-use', component: ConditionsOfUse },
    { path: 'privacy-notice', component: PrivacyNotice },
    { path: 'account', component: AccountDetail},
    { path: 'check-out', component: Cart},
    { path: 'orders', component: OrderDetail},
    { path: 'products', component: Products},
    { path: 'create-account', component: CreateAccount},
    { path: 'oasis', component: Oasis, canActivate: [authGuard]}
];
