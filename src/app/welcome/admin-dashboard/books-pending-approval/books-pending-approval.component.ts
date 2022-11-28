import {
  ChangeDetectionStrategy,
  OnDestroy,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { Display } from 'src/helpers/utils/display';
import { SubSink } from 'subsink';
import { UnapprovedPublishedBooksViewMdel } from '../unapproved-published-books.service';
import { LyTheme2, shadowBuilder, ThemeVariables } from '@alyle/ui';

const styles = (theme: ThemeVariables) => ({
  item: {
    padding: '0',
    background: 'white',
    boxShadow: shadowBuilder(1),
    borderRadius: '4px',
    height: '100%',
  },
});

@Component({
  selector: 'app-books-pending-approval',
  templateUrl: './books-pending-approval.component.html',
  styleUrls: ['./books-pending-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksPendingApprovalComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  unApprovedBooks?: IPublishedBook[];
  cardSpacing = Display.remToPixel(2);

  readonly classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2,
    private unapprovedBooksVM: UnapprovedPublishedBooksViewMdel,
    private _cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.subscriptions.sink = this.unapprovedBooksVM
      .getUnApprovedPublishedBooks$()
      .subscribe((unapprovedBooks) => {
        this.unApprovedBooks = unapprovedBooks;
        this._cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
