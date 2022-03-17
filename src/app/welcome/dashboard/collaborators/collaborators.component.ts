import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollaboratorsComponent {

  constructor() { }
  
  addACollaborator() {
   
  }
  
}
