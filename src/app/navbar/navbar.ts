import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/userprofile.service';

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

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.userService.loadUserProfile();
      } else {
        this.userService.clearProfile();
      }
    });
  }
}
