import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/userprofile.service';
import { AccountDetail } from '../component/account-detail/account-detail';
import { Profile } from '../model/userprofile.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  profile = signal<Profile | null>(null)

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      this.userService.getUserProfile().subscribe({
        next: (profile) => this.profile.set(profile)
      });
    }
  }
}


