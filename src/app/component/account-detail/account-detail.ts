import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/userprofile.service';
import { User } from '../../model/user.model';
import { Profile } from '../../model/userprofile.model';
import { FormsModule } from '@angular/forms';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-account-detail',
  imports: [FormsModule, Loading],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css',
})
export class AccountDetail implements OnInit{
  isLoading = signal(true);
  private router = inject(Router)
  private userService = inject(UserService)
  user = signal<Profile | null>(null)

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user.set(data);
        this.isLoading.set(false)
      }, error: (err) => {
        this.isLoading.set(false)
        console.error(err);
      }
    })
  }

  saveProfile(profile: Profile | null){
    if(!profile) return;

    console.log(profile)
    this.userService.editUserProfile(profile).subscribe({
      next:(data) => {
        this.user.set(data);
        console.log(profile)
      }, error(err) {
        console.error(err)
      },
    })
  }

}
