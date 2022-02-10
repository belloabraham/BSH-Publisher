import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Languages } from 'src/data/languages';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  subscriptions = new SubSink();
  constructor(ref: ChangeDetectorRef) {
    ref.detach();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {

   ;
    
  }
}
