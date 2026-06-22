import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../component/loading/loading';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
      role: 'ROLE_USER'
    }).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.authService.saveUsername(this.username);
        console.log('successfully created your acc in!')

        this.router.navigate(['/'])
      }, error(err) {
         console.error(err)
      }



    })
    
  }

}
