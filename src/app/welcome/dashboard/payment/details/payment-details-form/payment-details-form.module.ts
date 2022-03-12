import { NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { LyButtonModule } from '@alyle/ui/button';


const requiredModules=[TranslocoModule, ReactiveFormsModule, LyButtonModule]

@NgModule({
  declarations: [],
  imports: requiredModules,
  exports: requiredModules
})
export class PaymentDetailsFormModule { }
