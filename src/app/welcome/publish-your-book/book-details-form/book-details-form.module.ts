import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [],
  imports: [CommonModule, TranslocoModule, LyButtonModule, ReactiveFormsModule],
  exports: [
    TranslocoModule,
    LyButtonModule,
    ReactiveFormsModule,
  ],
})
export class BookDetailsFormModule {}
