import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { FirestoreService } from 'src/domain/remote-data-source/firebase/firestore.service';
import { Display } from 'src/helpers/utils/display';
import { PubDataViewModel } from './pub-data.viewmodels';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  providers: [
    {
      provide: DATABASE_IJTOKEN,
      useClass: FirestoreService,
    },
    PubDataViewModel
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  
  toolTipFontSize = Display.remToPixel(1.2).toString();

  //*Customized theme for Alyle Tooltip
  readonly classes = this._theme.addStyle(
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
  constructor(private _theme: LyTheme2, private pubDataViewModel: PubDataViewModel) {
    
  }
  
}
