import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Config } from 'src/data/config';
import { Route } from 'src/data/route';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-empty-book-store',
  templateUrl: './empty-book-store.component.html',
  styleUrls: ['./empty-book-store.component.scss'],
})
export class EmptyBookStoreComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  constructor(
    private title: Title,
    private localeService: LocaleService,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    cdRef: ChangeDetectorRef
  ) {
    cdRef.detach;
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.title.setTitle(
          this.localeService.paramTranslate(StringResKeys.title, {
            value: Config.appName,
          })
        );
      });
  }

  addABook() {
    this.router.navigate([Route.root, Route.welcome, Route.publishYourBook]);
  }

  logout() {
    this.userAuth.signOut().then(() => this.router.navigateByUrl(Route.root));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
