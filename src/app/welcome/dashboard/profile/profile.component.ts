import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { UserDataFormComponent } from 'src/app/shared/user-data-form/user-data-form.component';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { StringResKeys } from './locale/string-res-keys';
import { NotificationBuilder } from '../../../../helpers/utils/notification/notification-buider';
import { serverTimestamp } from '@angular/fire/firestore';
import { ICanDeactivate } from 'src/app/shared/i-can-deactivate';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { ICloudFunctions } from 'src/services/function/icloud-function';
import { CLOUD_FUNCTIONS } from 'src/services/function/function-token';
import { CloudFunctions } from 'src/services/function/cloud-functions';
import { Router } from '@angular/router';
import { Route } from 'src/domain/data/route';
import { Logger } from 'src/helpers/utils/logger';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, ICanDeactivate {
  profileForm!: FormGroup;
  userDataForm!: FormGroup;
  action = '';
  registeredDate = null;
  lastUpdated = serverTimestamp();

  canExitRoute = new Subject<boolean>();

  private unsavedFieldsMsgTitle = '';
  private unsavedFieldsMsg = '';
  private yes = '';
  private no = '';
  private updatedSucessMsg = '';
  private updatedFailedMsg = '';

  pubId = this.userAuth.getPubId()!;

  constructor(
    private localeService: LocaleService,
    @Inject(CLOUD_FUNCTIONS) private cloudFunctions: ICloudFunctions,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.translateStringRes();
    this.profileForm = new FormGroup({
      userDataForm: UserDataFormComponent.getUserDataForm(),
    });

    this.userDataForm = this.profileForm.get('userDataForm') as FormGroup;
  }

  private translateStringRes() {
    this.no = this.localeService.translate(StringResKeys.no);
    this.yes = this.localeService.translate(StringResKeys.yes);
    this.unsavedFieldsMsg = this.localeService.translate(
      StringResKeys.unsavedFieldsMsg
    );
    this.unsavedFieldsMsgTitle = this.localeService.translate(
      StringResKeys.unsavedFieldsMsgTitle
    );

    this.updatedFailedMsg = this.localeService.translate(
      StringResKeys.profileUpdatedFailedMsg
    );
    this.updatedSucessMsg = this.localeService.translate(
      StringResKeys.profileUpdatedSuccessMsg
    );

    this.action = this.localeService.translate(StringResKeys.update);
  }

  onDataUpdate(isSuccessful: boolean) {
    let notification = new NotificationBuilder().build();
    if (isSuccessful) {
      notification.success(this.updatedSucessMsg);
    } else {
      notification.error(this.updatedFailedMsg);
    }
  }

  logoutAllDevices() {
    const message = this.localeService.translate(
      StringResKeys.logoutAllDevRecomMsg
    );
    const title = this.localeService.translate(
      StringResKeys.logoutAllDevicesTitle
    );
    const proceed = this.localeService.translate(StringResKeys.proceed);
    const cancel = this.localeService.translate(StringResKeys.cancel);

    AlertDialog.warn(message, title, proceed, cancel, async () => {
      await this.revokeAllUserAuth();
    });
  }

  private async revokeAllUserAuth() {
    try {
      await this.cloudFunctions.call(CloudFunctions.revokeUserAuthToken);
      this.router.navigateByUrl(Route.root);
    } catch (error) {
      const failedMsg = this.localeService.translate(
        StringResKeys.allDevLogoutFailedMsg
      );
      Logger.error(this, 'revokeAllUserAuth', error);
      const notification = new NotificationBuilder().build();
      notification.error(failedMsg);
    }
  }

  canExit(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.profileForm.dirty) {
      AlertDialog.warn(
        this.unsavedFieldsMsg,
        this.unsavedFieldsMsgTitle,
        this.yes,
        this.no,
        () => this.canExitRoute.next(true),
        () => this.canExitRoute.next(false)
      );
      return this.canExitRoute;
    } else {
      return true;
    }
  }
}
