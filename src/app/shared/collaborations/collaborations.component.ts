import { LyTheme2, shadowBuilder, ThemeVariables } from '@alyle/ui';
import {
  ChangeDetectionStrategy,
  OnDestroy,
  Component,
  OnInit,
} from '@angular/core';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { SubSink } from 'subsink';
import { CollaborationsViewModel } from './collaborations.service';

const styles = (theme: ThemeVariables) => ({
  shadow: {
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
  collaborators?: ICollaborators[] = [
    /*{
      collabName: 'Bello Abraham',
      collabId: '67thjgvjkjdf',
      bookName: '50 Shades of Grey',
      dateCreated: new Date(),
      pubName: 'David Afolayan',
      bookId: '87564758690',
      collabCommissionInPercent: 5,
      link: 'hello.com',
      collabEmail: '',
      totalEarningsInNGN: 788,
      totalEarningsInUSD: 99889,
    },
    {
      collabName: 'Bello Abraham',
      collabId: '67thjgvjkjdf',
      bookName: '50 Shades of Grey',
      dateCreated: new Date(),
      pubName: 'David Afolayan',
      bookId: '87564758690',
      collabCommissionInPercent: 5,
      link: 'hello.com',
      collabEmail: '',
      totalEarningsInNGN: 788,
      totalEarningsInUSD: 99889,
    },*/
  ];

  readonly classes = this.theme.addStyleSheet(styles);

  constructor(
    private theme: LyTheme2,
    private collaborationsVM: CollaborationsViewModel
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.collaborationsVM
      .getCollaborations$()
      .subscribe((collaborations) => {
         this.collaborators = collaborations;
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
