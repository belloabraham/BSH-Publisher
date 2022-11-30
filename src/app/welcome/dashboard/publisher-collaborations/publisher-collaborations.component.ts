import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CollaborationsViewModel } from 'src/app/shared/collaborations/collaborations.service';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-publisher-collaborations',
  templateUrl: './publisher-collaborations.component.html',
  styleUrls: ['./publisher-collaborations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CollaborationsViewModel],
})
export class PublisherCollaborationsComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  constructor(
    private collaborationsVM: CollaborationsViewModel,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['collaborations']))
      .subscribe((collaborations: ICollaborators[]) => {
        this.collaborationsVM.setCollaborations(collaborations);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
} 
