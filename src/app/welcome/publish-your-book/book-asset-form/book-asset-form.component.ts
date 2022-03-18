import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import {
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent,
} from '@alyle/ui/image-cropper';

@Component({
  selector: 'app-book-asset-form',
  templateUrl: './book-asset-form.component.html',
  styleUrls: ['./book-asset-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookAssetFormComponent implements OnInit {
  bookAssetsForm!: FormGroup;

  bookDocumentFC!: FormControl;
  bookCoverFC!: FormControl;

  ready!: boolean;
  scale!: number;
  minScale!: number;

//  @ViewChild(LyImageCropper, { static: true }) cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`
    type: 'image/png', // Or you can also use `image/jpeg`
    output: {
      width: 200,
      height: 150,
    },
  };
  onCropped(e: ImgCropperEvent) {
    console.log('Cropped img: ', e);
  }

  onReady(e: ImgCropperEvent) {
    this.ready = true;
    console.log('Img ready for cropper', e);
  }

  onError(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
  }

  constructor(private parentForm: FormGroupDirective) {}

  ngOnInit(): void {
    this.bookAssetsForm = this.parentForm.control.get(
      'bookAssetsForm'
    ) as FormGroup;

    this.bookDocumentFC = this.bookAssetsForm.get(
      'bookDocumentFC'
    ) as FormControl;
    this.bookCoverFC = this.bookAssetsForm.get('bookCoverFC') as FormControl;
  }
}
