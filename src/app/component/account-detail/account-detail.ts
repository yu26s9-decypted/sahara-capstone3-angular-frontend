import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/userprofile.service';
import { User } from '../../model/user.model';
import { Profile } from '../../model/userprofile.model';
import { FormsModule } from '@angular/forms';
import { Loading } from '../loading/loading';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

@Component({
  selector: 'app-account-detail',
  imports: [FormsModule, Loading],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css',
})
export class AccountDetail implements OnInit{
  isLoading = signal(true);
  saveState = signal<SaveState>('idle');
  saveMessage = signal('');
  private router = inject(Router)
  private userService = inject(UserService)
  user = signal<Profile | null>(null)
  private savedUser = signal<Profile | null>(null)
  isSaving = signal(false);

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.setProfile(data);
        this.isLoading.set(false)
      }, error: (err) => {
        this.isLoading.set(false)
        console.error(err);
      }
    })
  }

  saveProfile(profile: Profile | null){
    if(!profile) return;

    this.isSaving.set(true);
    this.saveState.set('saving');
    this.saveMessage.set('');

    this.userService.editUserProfile({ ...profile }).subscribe({
      next:(data) => {
        this.setProfile(data);
        this.isSaving.set(false);
        this.saveState.set('saved');
        this.saveMessage.set('Account changes saved.');
      }, error: (err) => {
        this.isSaving.set(false);
        this.saveState.set('error');
        this.saveMessage.set('We could not save your changes. Please try again.');
        console.error(err)
      },
    })
  }

  resetForm(): void {
    const saved = this.savedUser();
    if (!saved || this.isSaving()) return;

    this.user.set({ ...saved });
    this.saveState.set('idle');
    this.saveMessage.set('');
  }

  clearSaveStatus(): void {
    if (this.saveState() === 'saving') return;

    this.saveState.set('idle');
    this.saveMessage.set('');
  }

  private setProfile(profile: Profile): void {
    this.user.set({ ...profile });
    this.savedUser.set({ ...profile });
    this.userService.profile.set(profile);
  }

}
