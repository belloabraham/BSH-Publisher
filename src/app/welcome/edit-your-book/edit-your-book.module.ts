import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditYourBookRoutingModule } from './edit-your-book-routing.module';
import { EditYourBookComponent } from './edit-your-book.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LyButtonModule } from '@alyle/ui/button';
import { TranslocoModule } from '@ngneat/transloco';
import { ImagePickerDialogModule } from '../../shared/image-picker-dialog/image-picker-dialog.module';

@NgModule({
  declarations: [
    EditYourBookComponent
  ],
  imports: [
    CommonModule,
    EditYourBookRoutingModule,
    ImagePickerDialogModule,
    LyButtonModule,
    TranslocoModule,
    ReactiveFormsModule
  ]
})
export class EditYourBookModule { }
