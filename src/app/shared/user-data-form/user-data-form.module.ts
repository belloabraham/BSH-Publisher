import { NgModule } from '@angular/core';
import { UserDataFormComponent } from './user-data-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [UserDataFormComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  exports: [UserDataFormComponent, CommonModule, ReactiveFormsModule, TranslocoModule],
})
export class UserDataFormModule {}
