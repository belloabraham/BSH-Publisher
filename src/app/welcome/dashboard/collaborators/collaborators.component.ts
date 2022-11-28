import { LyDialog } from '@alyle/ui/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { map } from 'rxjs';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { Notification } from 'src/helpers/notification/notification';
import { NotificationBuilder } from 'src/helpers/notification/notification-buider';
import { DateUtil } from 'src/helpers/utils/date-util';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { CloudFunctions } from 'src/services/function/cloud-functions';
import { CLOUD_FUNCTIONS } from 'src/services/function/function-token';
import { ICloudFunctions } from 'src/services/function/icloud-function';
import { SubSink } from 'subsink';
import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog/add-collaborators-dialog.component';
import { CollaboratorsViewModel } from './collaborators.service';

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CollaboratorsViewModel],
})
export class CollaboratorsComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  collaborators: ICollaborators[] | null = null;
  rootDomain = location.origin


  constructor(
    private activatedRoute: ActivatedRoute,
    private collaboratorsVM: CollaboratorsViewModel,
    private _dialog: LyDialog,
    private cdRef: ChangeDetectorRef,
    private clipboardService: ClipboardService,
    @Inject(CLOUD_FUNCTIONS) private cloudFunctions: ICloudFunctions
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['collaborators']))
      .subscribe((collaborators) => {
        if (collaborators) {
          this.collaboratorsVM.setCollaborators(collaborators);
        }
      });

    this.subscriptions.sink = this.collaboratorsVM
      .getCollaborators$()
      .subscribe((collaborators) => {
        if (collaborators) {
          this.collaborators = collaborators;
          this.cdRef.detectChanges();
        }
      });
  }

  copyLinkToClipBoard(link: string) {
    this.clipboardService.copy(link);
    const notification = new NotificationBuilder()
      .setTimeOut(Notification.SHORT_LENGHT)
      .build();
    notification.success("Link copied successfully");
  }

  getDateTime(timeStamp: Timestamp) {
    return DateUtil.getHumanReadbleDateTime(
      DateUtil.getLocalDateTime(timeStamp)
    );
  }

  async addACollaborator() {
    const dialogRef = this._dialog.open<AddCollaboratorsDialogComponent>(
      AddCollaboratorsDialogComponent,
      {
        width: 400,
      }
    );
    this.subscriptions.sink = dialogRef.afterClosed.subscribe(async (data) => {
      if (data) {
        const notification = new NotificationBuilder().build();
        //*Check if there is any collaborators at all
        const aCollaboratorsHaveBeenCreatedBefore = this.collaborators !== null 
    
        if (aCollaboratorsHaveBeenCreatedBefore) {
          const isAnExistingCollabForBook = this.collaborators!.find(
            (collab) =>
              collab.collabEmail === data.collabEmail &&
              collab.bookId === data.bookId
          );
          if (isAnExistingCollabForBook) {
            const errorMsg = `Collaborator with ${data.collabEmail} already exist for book with ID/ISBN ${data.bookId}`;
            notification.error(errorMsg);
          } else {
            await this.createACollaborator(data);
          }
        } else {
          await this.createACollaborator(data);
        }
      }
    });
  }

  async createACollaborator(data: ICollaborators) {
    Shield.pulse(
      '.collaborators',
      'Creating collaborator, please wait...'
    );
    const notification = new NotificationBuilder().build();

    try {
      await this.cloudFunctions.call(CloudFunctions.createACollaborator, data);
      Shield.remove('.collaborators');
      notification.success('Collaborator was created successfully');
      try {
        const collab = await this.collaboratorsVM.getRemoteCollaborators();
        this.collaboratorsVM.setCollaborators(collab);
      } catch (error) {
          Logger.error(this, this.createACollaborator.name, error);
      }
    } catch (error: any) {
      Logger.error(this, this.createACollaborator.name, error);
      Shield.remove('.collaborators');
      notification.error(`Network error or ${data.collabEmail} is yet to sign up on Bookshelf Hub.`);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
