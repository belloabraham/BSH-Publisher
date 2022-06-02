import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishYourBookRoutingModule } from './publish-your-book-routing.module';
import { PublishYourBookComponent } from './publish-your-book.component';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { LyButtonModule } from '@alyle/ui/button';
import { TranslocoModule } from '@ngneat/transloco';
import { ImagePickerDialogModule } from '../../shared/image-picker-dialog/image-picker-dialog.module';

@NgModule({
  declarations: [PublishYourBookComponent],
  imports: [
    CommonModule,
    PublishYourBookRoutingModule,
    LyExpansionModule,
    ReactiveFormsModule,
    LyButtonModule,
    TranslocoModule,
    ImagePickerDialogModule,
  ],
})
export class PublishYourBookModule {}
