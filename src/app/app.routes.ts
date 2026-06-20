import { Routes } from '@angular/router';
import { Products } from './products/products';
import { ProductDetail } from './productdetail/productdetail';
import { SignIn } from './auth/sign-in/sign-in';
import { ConditionsOfUse } from './legal/conditions-of-use/conditions-of-use';
import { PrivacyNotice } from './legal/privacy-notice/privacy-notice';
import { AccountDetail } from './component/account-detail/account-detail';

export const routes: Routes = [
    { path: '', component: Products },
    { path: 'product/:slug', component: ProductDetail },
    { path: 'sign-in', component: SignIn},
    { path: 'conditions-of-use', component: ConditionsOfUse },
    { path: 'privacy-notice', component: PrivacyNotice },
    { path: 'account', component: AccountDetail}
];
