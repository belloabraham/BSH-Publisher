import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Route } from 'src/data/route';
import { DashboardComponent } from '../dashboard.component';

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollaboratorsComponent {

  dashboard = DashboardComponent.dashboard
  collaborators = this.dashboard.concat(Route.collaborators);

  constructor() { }
  
  addACollaborator() {
   
  }
}
