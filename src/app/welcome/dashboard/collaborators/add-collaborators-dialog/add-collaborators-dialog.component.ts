import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-collaborators-dialog',
  templateUrl: './add-collaborators-dialog.component.html',
  styleUrls: ['./add-collaborators-dialog.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class AddCollaboratorsDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log()
  }

}
