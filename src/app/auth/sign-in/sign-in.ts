import { Component, inject, signal } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private router = inject(Router)
  private authService = inject(AuthService)

  username = ''
  password = ''
  error = signal('')
  isLoading = signal(false)

  login(){
    console.log('login invoked', this.username, this.password);
    this.isLoading.set(true)
    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.authService.saveUsername(this.username);
        console.log('successfully signed in!')

        this.router.navigate(['/'])
      }, error: () => {
        this.error.set('Invalid account credential. Please try again')
        this.isLoading.set(false)
      }
    })
  }
}
