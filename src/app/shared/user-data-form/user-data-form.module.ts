import { NgModule } from '@angular/core';
import { UserDataFormComponent } from './user-data-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  declarations: [UserDataFormComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule, LyButtonModule,],
  exports: [
    UserDataFormComponent,
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
})
export class UserDataFormModule {}
