import { LyDialogRef } from '@alyle/ui/dialog';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PubDataViewModel } from 'src/app/welcome/pub-data.viewmodels';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { ICreateCollab } from 'src/data/models/icreate-collab';
import { Regex } from 'src/data/regex';
import { getBookId } from 'src/helpers/get-book-id';
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
      collabName: this.nameFC.value,
      bookName: book.name,
      bookId: bookId,
      pubId: book.pubId,
      pubName: pub.firstName,
      dateCreated: null,
      collabId: null,
      link: null,
      collabEmail: this.emailFC.value,
      collabComm: this.commissionFC.value,
    };

     this.lyDialogRef.close(data);
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
