import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublisherCollaborationsRoutingModule } from './publisher-collaborations-routing.module';
import { PublisherCollaborationsComponent } from './publisher-collaborations.component';
import { CollaborationsModule } from '../../collaborations/collaborations.module';


@NgModule({
  declarations: [
    PublisherCollaborationsComponent
  ],
  imports: [
    CommonModule,
    PublisherCollaborationsRoutingModule,
    CollaborationsModule
  ]
})
export class PublisherCollaborationsModule { }
