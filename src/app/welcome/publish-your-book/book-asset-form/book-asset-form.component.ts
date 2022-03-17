import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-book-asset-form',
  templateUrl: './book-asset-form.component.html',
  styleUrls: ['./book-asset-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookAssetFormComponent implements OnInit {
  bookAssetsForm!: FormGroup;

  constructor(private parentForm: FormGroupDirective) {}

  ngOnInit(): void {
    this.bookAssetsForm = this.parentForm.control.get(
      'bookAssetsForm'
    ) as FormGroup;
  }

  
}