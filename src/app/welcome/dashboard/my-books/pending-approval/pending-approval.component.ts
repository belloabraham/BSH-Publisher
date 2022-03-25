import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pending-approval',
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingApprovalComponent {
  constructor() {}

}
