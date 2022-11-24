import {
  ChangeDetectionStrategy,
  OnDestroy,
  Component,
  OnInit,
} from '@angular/core';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-collaborations',
  templateUrl: './collaborations.component.html',
  styleUrls: ['./collaborations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaborationsComponent implements OnInit, OnDestroy{
  private subscriptions = new SubSink();

  constructor() {}

  ngOnInit(): void {
    console.log()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
