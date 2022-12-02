import { LyDialogRef } from '@alyle/ui/dialog';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { PubDataViewModel } from 'src/app/welcome/pub-data.service';
import { Config } from 'src/data/config';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { Regex } from 'src/data/regex';
import { unMergedBookId } from 'src/domain/unmeged-bookid';
import { escapeJSONNewlineChars } from 'src/helpers/utils/string-util';
import { PublishedBookViewModel } from '../../published-book.service';

@Component({
  selector: 'app-add-collaborators-dialog',
  templateUrl: './add-collaborators-dialog.component.html',
  styleUrls: ['./add-collaborators-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCollaboratorsDialogComponent implements OnInit {
  allBooks = this.pubBookVM.getAllBooks();
  readonly maxAllowedCommission = Config.MAX_ALLOWED_COLLAB_COMMISSION;

  collaboratorsForm!: UntypedFormGroup;
  getUnMergedBookId = unMergedBookId;

  emailFC = new UntypedFormControl('', [
    Validators.required,
    Validators.pattern(Regex.EMAIL),
  ]);
  nameFC = new UntypedFormControl(undefined, [Validators.required]);
  commissionFC = new UntypedFormControl(undefined, [Validators.required]);
  bookIDFC = new UntypedFormControl(undefined, [Validators.required]);
  rootDomain = location.origin;

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
    const bookId: string = this.bookIDFC.value;
    const book = this.pubBookVM.getPublishedBookById(bookId)!;
    const commission = Number(this.commissionFC.value);
    const collabCommission =
      commission > this.maxAllowedCommission ? this.maxAllowedCommission : commission;
    const data: ICollaborators = {
      collabName: escapeJSONNewlineChars(this.nameFC.value),
      bookName: book.name,
      bookId: bookId,
      pubName: pub.firstName,
      dateCreated: null,
      collabId: null,
      link: null,
      collabEmail: `${this.emailFC.value}`.trim(),
      collabCommissionInPercent: collabCommission,
      totalEarningsInNGN: 0,
      totalEarningsInUSD: 0,
    };

    this.lyDialogRef.close(data);
  }

  getCollaboratorsForm() {
    return new UntypedFormGroup({
      nameFC: this.nameFC,
      bookFC: this.bookIDFC,
      commissionFC: this.commissionFC,
      emailFC: this.emailFC,
    });
  }
}
