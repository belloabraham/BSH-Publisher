import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishYourBookRoutingModule } from './publish-your-book-routing.module';
import { PublishYourBookComponent } from './publish-your-book.component';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { BookAssetFormModule } from './book-asset-form/book-asset-form.module';
import { BookDetailsFormModule } from './book-details-form/book-details-form.module';

import { LyExpansionIconModule } from '@alyle/ui';

@NgModule({
  declarations: [
    PublishYourBookComponent
  ],
  imports: [
    CommonModule,
    PublishYourBookRoutingModule,
    LyExpansionModule,
    BookAssetFormModule,
    BookDetailsFormModule,
    LyExpansionIconModule
  ]
})
export class PublishYourBookModule { }
