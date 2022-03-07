import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { UserDataFormComponent } from 'src/app/shared/user-data-form/user-data-form.component';
import { ICanDeactivate } from 'src/guards/i-can-deactivate';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, ICanDeactivate {
  
  profileForm!: FormGroup;

  userDataForm!: FormGroup;

  canExitRoute = new Subject<boolean>();
  
  constructor() { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      userDataForm: UserDataFormComponent.getUserDataForm(),
    });

    this.userDataForm = this.profileForm.get('userDataForm') as FormGroup;
  }


  canExit(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.profileForm.dirty) {
      AlertDialog.warn(
        "ljk;l",
        "l;jkl;",
        "Yes",
        "No",
        () => this.canExitRoute.next(true),
        () => this.canExitRoute.next(false)
      );
      return this.canExitRoute;
    } else {
      return true;
    }
  }
}
