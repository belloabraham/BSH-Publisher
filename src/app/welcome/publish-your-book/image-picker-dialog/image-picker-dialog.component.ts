import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  StyleRenderer,
  WithStyles,
  lyl,
  ThemeRef,
  ThemeVariables,
  YPosition,
} from '@alyle/ui';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import {
  STYLES as CROPPER_STYLES,
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent,
} from '@alyle/ui/image-cropper';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(SLIDER_STYLES);
  ref.renderStyleSheet(CROPPER_STYLES);
  const slider = ref.selectorsOf(SLIDER_STYLES);
  const cropper = ref.selectorsOf(CROPPER_STYLES);

  return {
    root: lyl`{
      ${cropper.root} {
        max-width: 320px
        height: 320px
      }
    }`,
    sliderContainer: lyl`{
      position: relative
      ${slider.root} {
        width: 80%
        position: absolute
        left: 0
        right: 0
        margin: auto
        top: -32px
      }
    }`,
    slider: lyl`{
      padding: 1em
    }`,
  };
};

@Component({
  selector: 'app-image-picker-dialog',
  templateUrl: './image-picker-dialog.component.html',
  styleUrls: ['./image-picker-dialog.component.scss'],
})
export class ImagePickerDialogComponent implements WithStyles, AfterViewInit {
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');

  bottom = YPosition.below;
  ready: boolean = false;
  scale: number = 0;
  minScale: number = 0;
  @ViewChild(LyImageCropper, { static: true }) cropper!: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 400,
    height: 500,
    type: 'image/png',
    keepAspectRatio: true,
    responsiveArea: true,
    output: {
      width: 400,
      height: 500,
    },
     resizableArea: true,
  };

  constructor(
    @Inject(LY_DIALOG_DATA) private event: Event,
    readonly sRenderer: StyleRenderer,
    public dialogRef: LyDialogRef
  ) {}

  ngAfterViewInit() {
    // Load image when dialog animation has finished
    this.dialogRef.afterOpened.subscribe(() => {
      this.cropper.selectInputEvent(this.event);
    });
  }

  scaleN(e: any) {
    this.scale = e.value;
  }

  onCropped(e: ImgCropperEvent) {
    console.log('cropped img: ', e);
  }
  onLoaded(e: ImgCropperEvent) {
    console.log('img loaded', e);
  }
  onError(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
    // Close the dialog if it fails
    this.dialogRef.close();
  }
}