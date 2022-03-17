import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-book-details-form',
  templateUrl: './book-details-form.component.html',
  styleUrls: ['./book-details-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsFormComponent implements OnInit {

  bookDetailsForm!: FormGroup;

  constructor(private parentForm: FormGroupDirective) {}

  ngOnInit(): void {
    this.bookDetailsForm = this.parentForm.control.get('bookDetailsForm') as FormGroup;
  }
}
