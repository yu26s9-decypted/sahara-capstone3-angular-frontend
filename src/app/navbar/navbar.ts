import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/userprofile.service';
import { ShoppingCartService } from '../services/shoppingcart.service';
import { Profile } from '../model/userprofile.model';

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
  user = signal<Profile | null>(null);
  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.userService.loadUserProfile();
        this.cartService.loadCart();

        this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user.set(data);
      }, error: (err) => {
        console.error(err);
      }
    })
      } else {
        this.userService.clearProfile();
      }
    });

    
  }
}
