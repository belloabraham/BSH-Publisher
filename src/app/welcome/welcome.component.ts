import { Component } from '@angular/core';
import { DATABASE_IJTOKEN } from 'src/services/database/database.token';
import { FirestoreService } from 'src/services/database/firebase/firestore.service';

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
})
export class WelcomeComponent {
  constructor() {
  }
}
