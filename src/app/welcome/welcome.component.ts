import { ChangeDetectorRef, Component } from '@angular/core';
import { DATABASE } from 'src/services/database/database.token';
import { FirestoreService } from 'src/services/database/firebase/firestore.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  providers: [
    {
      provide: DATABASE,
      useClass: FirestoreService,
    },
  ],
})
export class WelcomeComponent {
  constructor(cdRef: ChangeDetectorRef) {
    cdRef.detach
  }
}
