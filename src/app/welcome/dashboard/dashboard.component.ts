import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Config } from 'src/data/config';
import { Route } from 'src/data/route';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH } from 'src/services/authentication/user-auth.token';
import { DATABASE } from 'src/services/database/database.token';
import { IDatabase } from 'src/services/database/idatabase';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  openLeftNav = true;
  openRightNav = false;

  constructor(
    private title: Title,
    private localeService: LocaleService,
    @Inject(DATABASE) private database: IDatabase,
    @Inject(USER_AUTH) private userAuth: IUserAuth,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.setTitle();
      });
  }


   logout() {
     this.userAuth.signOut()
       .then(() => {
         this.router.navigateByUrl(Route.root)
       })
   }
  
  logoutAllDevices() {
    
  }

  private setTitle() {
    this.title.setTitle(
      this.localeService.paramTranslate(StringResKeys.title, {
        value: Config.appName,
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
