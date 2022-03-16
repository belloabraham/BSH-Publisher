import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishYourBookRoutingModule } from './publish-your-book-routing.module';
import { PublishYourBookComponent } from './publish-your-book.component';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { LyButtonModule } from '@alyle/ui/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { BookDetailsFormComponent } from './book-details-form/book-details-form.component';
import { BookAssetFormComponent } from './book-asset-form/book-asset-form.component';


@NgModule({
  declarations: [
    PublishYourBookComponent,
    BookDetailsFormComponent,
    BookAssetFormComponent
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
