import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookAssetFormComponent } from './book-asset-form.component';
import { TranslocoModule } from '@ngneat/transloco';
import { LyButtonModule } from '@alyle/ui/button';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [BookAssetFormComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    LyButtonModule,
    ReactiveFormsModule
  ],
  exports: [
    BookAssetFormComponent,
    TranslocoModule,
    LyButtonModule,
    ReactiveFormsModule
  ]
})
export class BookAssetFormModule { }
