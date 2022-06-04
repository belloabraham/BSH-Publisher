import { LyTheme2, ThemeVariables } from '@alyle/ui';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { Fields } from 'src/data/remote-data-source/fields';
import { FirestoreService } from 'src/data/remote-data-source/firebase/firestore.service';
import { Display } from 'src/helpers/utils/display';
import { CloudStorageService } from 'src/services/storage/firebase/cloud-storage.service';
import { CLOUD_STORAGE_IJTOKEN } from 'src/services/storage/icloud-storage-token';
import { SubSink } from 'subsink';
import { IncomingRouteService } from '../shared/incoming-route.service';
import { PaymentDetailsViewModel } from './dashboard/payment/payment-details.viewmodel';
import { PubDataViewModel } from './pub-data.viewmodels';
import { PublishYourBookViewModel } from './publish-your-book.viewmodel';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  providers: [
    {
      provide: DATABASE_IJTOKEN,
      useClass: FirestoreService,
    },
    {
      provide: CLOUD_STORAGE_IJTOKEN,
      useClass: CloudStorageService,
    },
    IncomingRouteService,
    PaymentDetailsViewModel,
    PublishYourBookViewModel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  //Required by Alyle
  toolTipFontSize = Display.remToPixel(1.2).toString();
  readonly classes = this.getAlyleToolTipCustStyle();

  constructor(
    private _theme: LyTheme2,
    private pubDataViewModel: PubDataViewModel,
    private paymentDetailsVM: PaymentDetailsViewModel,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['pubData']))
      .subscribe((pubData: QueryDocumentSnapshot<DocumentData>) => {
        const pubProfile = pubData.get(Fields.pubData);
        this.pubDataViewModel.setPublisher(pubProfile);
        const paymentDetails = pubData.get(Fields.paymentDetails);
        if (paymentDetails) {
          this.paymentDetailsVM.setPaymentDetails(paymentDetails);
        }
      });
  }

  private getAlyleToolTipCustStyle() {
    return this._theme.addStyle(
      'LyTooltip',
      (theme: ThemeVariables) => ({
        borderRadius: '4px',
        fontSize: this.toolTipFontSize,
        padding: '0 8px 4px',
        opacity: 1,
        transition: `opacity ${theme.animations.curves.standard} 200ms`,
        left: 0,
      }),
      undefined,
      undefined,
      -2
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
