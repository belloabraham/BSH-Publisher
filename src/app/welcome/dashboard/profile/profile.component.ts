import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { UserDataFormComponent } from 'src/app/shared/user-data-form/user-data-form.component';
import { ICanDeactivate } from 'src/guards/i-can-deactivate';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { StringResKeys } from './locale/string-res-keys';
import { NotificationBuilder } from '../../../../helpers/utils/notification/notification-buider';
import { serverTimestamp } from '@angular/fire/firestore';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

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

  constructor(private localeService: LocaleService) {}

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
