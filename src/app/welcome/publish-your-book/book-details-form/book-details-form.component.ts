import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-book-details-form',
  templateUrl: './book-details-form.component.html',
  styleUrls: ['./book-details-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsFormComponent implements OnInit {
  bookDetailsForm!: FormGroup;

  bookNameFC!: FormControl;
  bookDescFC!: FormControl;
  bookCurrencyFC!: FormControl;
  bookAuthorFC!: FormControl;
  bookISBNFC!: FormControl;
  bookCatgoryFC!: FormControl;
  bookPriceFC!: FormControl;
  bookTagFC!: FormControl;

  constructor(private parentForm: FormGroupDirective) {}

  ngOnInit(): void {
    this.getBookDetailsForm();
  }

  private getBookDetailsForm() {
    this.bookDetailsForm = this.parentForm.control.get(
      'bookDetailsForm'
    ) as FormGroup;

    this.bookNameFC = this.bookDetailsForm.get('bookNameFC') as FormControl;
    this.bookDescFC = this.bookDetailsForm.get('bookDescFC') as FormControl;

    this.bookCurrencyFC = this.bookDetailsForm.get(
      'bookCurrencyFC'
    ) as FormControl;
    this.bookTagFC = this.bookDetailsForm.get('bookTagFC') as FormControl;

    this.bookCatgoryFC = this.bookDetailsForm.get(
      'bookCatgoryFC'
    ) as FormControl;
    this.bookPriceFC = this.bookDetailsForm.get('bookPriceFC') as FormControl;

    this.bookISBNFC = this.bookDetailsForm.get('bookISBNFC') as FormControl;
    this.bookAuthorFC = this.bookDetailsForm.get('bookAuthorFC') as FormControl;
  }
}
