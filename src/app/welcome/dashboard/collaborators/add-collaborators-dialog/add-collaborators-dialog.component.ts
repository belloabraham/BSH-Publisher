import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PubDataViewModel } from 'src/app/welcome/pub-data.viewmodels';
import { Regex } from 'src/data/regex';
import { getBookId } from 'src/helpers/get-book-id';
import { Display } from 'src/helpers/utils/display';
import { Shield } from 'src/helpers/utils/shield';
import { PublishedBookViewModel } from '../../published-book.viewmodel';

@Component({
  selector: 'app-add-collaborators-dialog',
  templateUrl: './add-collaborators-dialog.component.html',
  styleUrls: ['./add-collaborators-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCollaboratorsDialogComponent implements OnInit {
  allBooks = this.pubBookVM.getAllBooks();

  collaboratorsForm!: FormGroup;
  getBookId = getBookId;

  emailFC = new FormControl('', [
    Validators.required,
    Validators.pattern(Regex.EMAIL),
  ]);
  nameFC = new FormControl(undefined, [Validators.required]);
  commissionFC = new FormControl(undefined, [Validators.required]);
  bookFC = new FormControl(undefined, [Validators.required]);

  constructor(
    private pubBookVM: PublishedBookViewModel,
    private pubData: PubDataViewModel,
    private cdRef:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.collaboratorsForm = this.getCollaboratorsForm();
  }


  createAcollaborator() {
    Shield.pulse('.collab-dialog', Display.remToPixel(1.2),'Creating collaborator, please waite...');
  }

  getCollaboratorsForm() {
    return new FormGroup({
      nameFC: this.nameFC,
      bookFC: this.bookFC,
      commissionFC: this.commissionFC,
      emailFC: this.emailFC,
    });
  }
}
