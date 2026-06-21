import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/userprofile.service';
import { ShoppingCartService } from '../services/shoppingcart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AuthService);
  userService = inject(UserService);
  profile = this.userService.profile;
  cartService = inject(ShoppingCartService)
  searchQuery = signal('')
  private router = inject(Router)

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.userService.loadUserProfile();
        this.cartService.loadCart();
      } else {
        this.userService.clearProfile();
      }
    });

    
  }

  searchProducts(query: string){
    console.log(query)
    this.router.navigate(['/products'], {queryParams: { name: query}})
  }
}
