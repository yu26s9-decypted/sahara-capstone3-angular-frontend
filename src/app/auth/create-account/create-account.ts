import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../component/loading/loading';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-create-account',
  imports: [FormsModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
})
export class CreateAccount {
  isLoading = signal(false);
  private authService = inject(AuthService)
  private router = inject(Router)
  username = ''
  password = ''
  confirmPassword = ''
  error = signal('')

  createAccount(){
    if(this.isLoading()) return;  
    console.log('signup invoked', this.username, this.password)

    this.isLoading.set(true)
    this.authService.signUp({
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword,
      role: 'ROLE_USER',
    }).pipe(
      switchMap(() => this.authService.login({
        username: this.username,
        password: this.password,
      }))
    ).subscribe({
      next: (res) => {
        this.authService.saveUsername(this.username);
        this.authService.saveToken(res.token);
        console.log('successfully created your acc in!')
        this.isLoading.set(false)
        this.router.navigate(['/'])
      }, error: (err) => {
        this.isLoading.set(false)
         console.error(err)
      }



    })
    
  }

}
