import { LyDialogRef } from '@alyle/ui/dialog';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PubDataViewModel } from 'src/app/welcome/pub-data.viewmodels';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { Regex } from 'src/data/regex';
import { getBookId } from 'src/helpers/get-book-id';
import { escapeJSONNewlineChars } from 'src/helpers/utils/string-util';
import { PublishedBookViewModel } from '../../published-book.viewmodel';

@Component({
  selector: 'app-add-collaborators-dialog',
  templateUrl: './add-collaborators-dialog.component.html',
  styleUrls: ['./add-collaborators-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCollaboratorsDialogComponent implements OnInit {
  allBooks = this.pubBookVM.getAllBooks();

  collaboratorsForm!: UntypedFormGroup;
  getBookId = getBookId;

  emailFC = new UntypedFormControl('', [
    Validators.required,
    Validators.pattern(Regex.EMAIL),
  ]);
  nameFC = new UntypedFormControl(undefined, [Validators.required]);
  commissionFC = new UntypedFormControl(undefined, [Validators.required]);
  bookFC = new UntypedFormControl(undefined, [Validators.required]);

  constructor(
    private pubBookVM: PublishedBookViewModel,
    private pubData: PubDataViewModel,
    private lyDialogRef: LyDialogRef
  ) {}

  ngOnInit(): void {
    this.collaboratorsForm = this.getCollaboratorsForm();
  }

   createAcollaborator() {
    const pub = this.pubData.getPublisher()!;
    const bookId: string = this.bookFC.value;
    const book = this.pubBookVM.getPublishedBookById(bookId)!;
    const data: ICollaborators = {
      collabName: escapeJSONNewlineChars(this.nameFC.value),
      bookName: book.name,
      bookId: bookId,
      pubId: book.pubId,
      pubName: pub.firstName,
      dateCreated: null,
      collabId: null,
      link: null,
      collabEmail: escapeJSONNewlineChars(this.emailFC.value),
      collabComm: this.commissionFC.value,
    };

     this.lyDialogRef.close(data);
  }

  getCollaboratorsForm() {
    return new UntypedFormGroup({
      nameFC: this.nameFC,
      bookFC: this.bookFC,
      commissionFC: this.commissionFC,
      emailFC: this.emailFC,
    });
  }
}
