import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { IEarnings } from 'src/data/models/entities/iearnings';
import { SubSink } from 'subsink';
import { EarningsViewModel } from './earning.viewmodel';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarningsComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  earnings?:IEarnings[]
  
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['earnings']))
      .subscribe((earnings) => {
        if (earnings) {
          this.earnings = earnings
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getBookName() {
    
  }
}
