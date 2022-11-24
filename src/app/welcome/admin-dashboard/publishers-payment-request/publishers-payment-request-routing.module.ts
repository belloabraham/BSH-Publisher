import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishersPaymentRequestComponent } from './publishers-payment-request.component';

const routes: Routes = [{ path: '', component: PublishersPaymentRequestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishersPaymentRequestRoutingModule { }
