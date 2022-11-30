import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CollaborationsViewModel } from 'src/app/shared/collaborations/collaborations.service';
import { Config } from 'src/data/config';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { LocaleService } from 'src/services/transloco/locale.service';
import { SubSink } from 'subsink';
import { StringResKeys } from '../../welcome/collaborator-collaborations/locale/string-res-keys';

@Component({
  selector: 'app-collaborator-collaborations',
  templateUrl: './collaborator-collaborations.component.html',
  styleUrls: ['./collaborator-collaborations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[CollaborationsViewModel]
})
export class CollaboratorCollaborationsComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  constructor(
    private title: Title,
    private collaborationsVM: CollaborationsViewModel,
    private localeService: LocaleService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['collaborations']))
      .subscribe((collaborations: ICollaborators[]) => {
        this.collaborationsVM.setCollaborations(collaborations);
      });

    this.getStringRes();
  }

  private getStringRes() {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.title.setTitle(
          this.localeService.paramTranslate(StringResKeys.title, {
            value: Config.APP_NAME,
          })
        );
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
