import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDetailsFormComponent } from './book-details-form.component';
import { LyButtonModule } from '@alyle/ui/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [BookDetailsFormComponent],
  imports: [CommonModule, TranslocoModule, LyButtonModule, ReactiveFormsModule],
  exports: [
    BookDetailsFormComponent,
    TranslocoModule,
    LyButtonModule,
    ReactiveFormsModule,
  ],
})
export class BookDetailsFormModule {}
