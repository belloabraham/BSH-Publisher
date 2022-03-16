import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishYourBookRoutingModule } from './publish-your-book-routing.module';
import { PublishYourBookComponent } from './publish-your-book.component';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { LyButtonModule } from '@alyle/ui/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    PublishYourBookComponent
  ],
  imports: [
    CommonModule,
    PublishYourBookRoutingModule,
    LyExpansionModule,
    LyButtonModule,
    ReactiveFormsModule,
    TranslocoModule
  ]
})
export class PublishYourBookModule { }
