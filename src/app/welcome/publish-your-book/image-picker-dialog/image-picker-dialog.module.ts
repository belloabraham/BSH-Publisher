import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyDialogModule } from '@alyle/ui/dialog';
import { ImagePickerDialogComponent } from './image-picker-dialog.component';
import { LyTooltipModule } from '@alyle/ui/tooltip';

@NgModule({
  declarations: [ImagePickerDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyDialogModule,
    LyTooltipModule
  ],
  exports: [ImagePickerDialogComponent],
})
export class ImagePickerDialogModule {}
