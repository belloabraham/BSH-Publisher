import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollaboratorsViewModel } from './collaborators.viewmodel';

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[CollaboratorsViewModel]
})
export class CollaboratorsComponent {

  constructor() { }
  
  addACollaborator() {
   
  }
  
}
