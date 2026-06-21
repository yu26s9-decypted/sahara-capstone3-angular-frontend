import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  @Input() label = 'Loading...';
  @Input() compact = false;
  @Input() fullViewport = false;
}
