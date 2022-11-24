import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-books-pending-approval',
  templateUrl: './books-pending-approval.component.html',
  styleUrls: ['./books-pending-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BooksPendingApprovalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
