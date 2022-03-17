import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { FirestoreService } from 'src/domain/remote-data-source/firebase/firestore.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  providers: [
    {
      provide: DATABASE_IJTOKEN,
      useClass: FirestoreService,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  constructor() {}
}
