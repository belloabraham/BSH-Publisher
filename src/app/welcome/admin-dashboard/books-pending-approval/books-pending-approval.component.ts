import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { UnapprovedPublishedBooksViewMdel } from '../unapproved-published-books.service';

@Component({
  selector: 'app-books-pending-approval',
  templateUrl: './books-pending-approval.component.html',
  styleUrls: ['./books-pending-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksPendingApprovalComponent implements OnInit {
  private subscriptions = new SubSink();

  constructor(
    private activatedRoute: ActivatedRoute,
    private unapprovedBooksVM:UnapprovedPublishedBooksViewMdel
  ) { }

  ngOnInit(): void {
     this.subscriptions.sink = this.activatedRoute.data
       .pipe(map((data) => data['unApprovedBooks']))
       .subscribe((unApprovedBooks) => {
         if (unApprovedBooks) {
           this.unapprovedBooksVM.setAllBooks(unApprovedBooks);
         }
       });
  }
}
