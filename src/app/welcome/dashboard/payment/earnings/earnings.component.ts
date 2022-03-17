import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarningsComponent {
  constructor() {}
}
