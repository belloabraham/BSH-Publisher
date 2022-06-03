import { LyDialog } from '@alyle/ui/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog/add-collaborators-dialog.component';
import { CollaboratorsViewModel } from './collaborators.viewmodel';

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CollaboratorsViewModel],
})
export class CollaboratorsComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  constructor(
    private activatedRoute: ActivatedRoute,
    private collaboratorsVM: CollaboratorsViewModel,
    private _dialog: LyDialog
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['collaborators']))
      .subscribe((collaborators) => {
        if (collaborators) {
          this.collaboratorsVM.setCollaborators(collaborators);
        }
      });
  }



  addACollaborator() {
    const dialogRef = this._dialog.open<AddCollaboratorsDialogComponent>(
      AddCollaboratorsDialogComponent,
      {
        width: 320,
      }
    );
    dialogRef.afterClosed.subscribe((result) => console.log(result));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
