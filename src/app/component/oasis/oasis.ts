import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/userprofile.service';
import { Profile } from '../../model/userprofile.model';
import { PaymentService } from '../../services/stripe.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oasis',
  imports: [],
  templateUrl: './oasis.html',
  styleUrl: './oasis.css',
})
export class Oasis implements OnInit {
  private userService = inject(UserService)
  private authService = inject(AuthService);
  user = signal<Profile | null>(null)
  paymentService = inject(PaymentService);
  private router = inject(Router);
  private priceId = 'price_1TlFJkFXtxuP1VoA8zWqkXe6';
  isProfileLoading = signal(true);
  isSubscriptionLoading = signal(false);
  subscriptionError = signal('');
  checkoutStatus = signal<'success' | 'cancel' | null>(null);

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    if (this.router.url.includes('success=true')) {
      this.checkoutStatus.set('success');
    }

    if (this.router.url.includes('success=false')) {
      this.checkoutStatus.set('cancel');
    }

    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userService.profile.set(profile);
        this.user.set(profile);
        this.isProfileLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isProfileLoading.set(false);
      }
    });
  }

  createSubscription(){
    if (this.isSubscriptionLoading()) return;

    this.isSubscriptionLoading.set(true);
    this.subscriptionError.set('');

    this.paymentService.createCheckOutSession(this.priceId).subscribe({
      next: async (data) => {
        if (!data.url) {
          this.subscriptionError.set('Checkout could not be started. Please try again.');
          this.isSubscriptionLoading.set(false);
          return;
        }

        window.location.href = data.url;
      }, error: (err) => {
        console.error(err);
        this.subscriptionError.set('Checkout could not be started. Please try again.');
        this.isSubscriptionLoading.set(false);
      },
    })
  }

  closeCheckoutModal(): void {
    this.checkoutStatus.set(null);
    this.router.navigate(['/oasis']);
  }
}
