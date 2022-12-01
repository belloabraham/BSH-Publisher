import { LyTheme2 } from '@alyle/ui';
import {
  ChangeDetectionStrategy,
  OnDestroy,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { map } from 'rxjs';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { Notification } from 'src/helpers/notification/notification';
import { NotificationBuilder } from 'src/helpers/notification/notification-buider';
import { LocaleService } from 'src/services/transloco/locale.service';
import { shadow } from 'src/theme/styles';
import { SubSink } from 'subsink';
import { CollaborationsViewModel } from './collaborations.service';
import { StringResKeys } from './locale/string-res-keys';

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
    },
  ];

  readonly classes = this.theme.addStyleSheet(shadow());

  constructor(
    private theme: LyTheme2,
    private localeService: LocaleService,
    private clipboardService: ClipboardService,
    private collaborationsVM: CollaborationsViewModel,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['collaborations']))
      .subscribe((collaborations: ICollaborators[]) => {
        this.collaborationsVM.setCollaborations(collaborations);
      });

    this.subscriptions.sink = this.collaborationsVM
      .getCollaborations$()
      .subscribe((collaborations) => {
        if (collaborations.length > 0) {
          this.collaborators = collaborations;
        }
      });
  }

  copySaleLink(link: string) {
    this.clipboardService.copy(link);
    const copyMsg = this.localeService.translate(StringResKeys.linkCopiedMsg);
    const notification = new NotificationBuilder()
      .setTimeOut(Notification.SHORT_LENGHT)
      .build();
    notification.success(copyMsg);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
