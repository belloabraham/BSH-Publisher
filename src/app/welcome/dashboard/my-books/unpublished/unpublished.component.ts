import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-unpublished',
  templateUrl: './unpublished.component.html',
  styleUrls: ['./unpublished.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnpublishedComponent{
  constructor() {}

}
