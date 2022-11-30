import { LyTheme2, shadowBuilder, ThemeVariables } from '@alyle/ui';
import {
  ChangeDetectionStrategy,
  OnDestroy,
  Component,
  OnInit,
} from '@angular/core';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { SubSink } from 'subsink';

const styles = (theme: ThemeVariables) => ({
  item: {
    boxShadow: shadowBuilder(1),
  },
});

@Component({
  selector: 'app-collaborations',
  templateUrl: './collaborations.component.html',
  styleUrls: ['./collaborations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollaborationsComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  NGN = 'NGN';
  USD = 'USD';
  collaborators?: ICollaborators[];

  readonly classes = this.theme.addStyleSheet(styles);
  constructor(private theme: LyTheme2) {}

  ngOnInit(): void {
    console.log();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
