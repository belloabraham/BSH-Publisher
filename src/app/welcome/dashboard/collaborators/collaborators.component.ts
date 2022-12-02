import { LyTheme2 } from '@alyle/ui';
import { LyDialog } from '@alyle/ui/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { map } from 'rxjs';
import { Config } from 'src/data/config';
import { ICollaborators as ICollaborator } from 'src/data/models/entities/icollaborators';
import { Fields } from 'src/data/remote-data-source/fields';
import { unMergedBookId } from 'src/domain/unmeged-bookid';
import { Notification } from 'src/helpers/notification/notification';
import { NotificationBuilder } from 'src/helpers/notification/notification-buider';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { DateUtil } from 'src/helpers/utils/date-util';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { CloudFunctions } from 'src/services/function/cloud-functions';
import { CLOUD_FUNCTIONS } from 'src/services/function/function-token';
import { ICloudFunctions } from 'src/services/function/icloud-function';
import { shadow } from 'src/theme/styles';
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
  collaborators?: ICollaborator[];
  rootDomain = location.origin;
  pubId = this.userAuth.getPubId()!!;
  getUnMergedBookId = unMergedBookId;
  readonly maxAllowedCommission = Config.MAX_ALLOWED_COLLAB_COMMISSION;

  readonly classes = this.theme.addStyleSheet(shadow());

  constructor(
    private theme: LyTheme2,
    private activatedRoute: ActivatedRoute,
    private collaboratorsVM: CollaboratorsViewModel,
    private _dialog: LyDialog,
    private cdRef: ChangeDetectorRef,
    private clipboardService: ClipboardService,
    private ngZone: NgZone,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
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
        if (collaborators.length > 0) {
          this.collaborators = collaborators;
          this.cdRef.detectChanges();
        }
      });
  }

  async editCollaborator(collaborator: ICollaborator) {
    const oldCommission = collaborator.collabCommissionInPercent;
    AlertDialog.prompt(
      `${oldCommission}`,
      "Update Colaborator's Commission",
      "Enter new collaborator's commission in % ("+this.maxAllowedCommission+" max)",
      'Update',
      'Cancel',
      (value) =>
        this.ngZone.run(async () => {
          let commission = Number(value);
          if (typeof commission === 'number') {
            const newCommission =
              commission > this.maxAllowedCommission
                ? this.maxAllowedCommission
                : commission;
            const notification = new NotificationBuilder();
            try {
              Shield.pulse(
                '.collaborators-table',
                'Updating collaborators commission. Please wait'
              );
              const collabIdAndBookId = `${collaborator.collabId}-${collaborator.bookId}`;
              await this.collaboratorsVM.updateCollaborator(
                collabIdAndBookId,
                Fields.collabCommissionInPercent,
                newCommission
              );
              notification.setTimeOut(Notification.SHORT_LENGHT);
              notification
                .build()
                .success(
                  'Updated ' +
                    collaborator.collabName +
                    " collaboration's commission successfully."
                );

              this.updateCollaboratorsState(collaborator, newCommission);
            } catch (error) {
              Logger.error(this, this.editCollaborator.name, error);
              notification
                .build()
                .error(
                  'Connection Error: Unable to update ' +
                    collaborator.collabName +
                    " collaboration's commission. Try again later."
                );
            } finally {
              Shield.remove('.collaborators-table');
            }
          } else {
            AlertDialog.error(
              "Enater a valid number for collaborator's commission",
              'Invalid Number',
              'OK'
            );
          }
        })
    );
  }

  private updateCollaboratorsState(
    collaborator: ICollaborator,
    newCommission: number
  ) {
    const indexOfCollaborator = this.collaborators!.indexOf(collaborator);
    this.collaborators![indexOfCollaborator].collabCommissionInPercent =
      newCommission;
    this.collaboratorsVM.setCollaborators(this.collaborators!.concat([]));
  }

  copyLinkToClipBoard(link: string) {
    this.clipboardService.copy(link);
    const notification = new NotificationBuilder()
      .setTimeOut(Notification.SHORT_LENGHT)
      .build();
    notification.success('Link copied successfully');
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
        const aCollaboratorsHaveBeenCreatedBefore =
          this.collaborators !== undefined;

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

  async createACollaborator(collaborator: ICollaborator) {
    Shield.pulse('.collaborators', 'Creating collaborator, please wait...');
    const notification = new NotificationBuilder().build();

    try {
      await this.cloudFunctions.call(
        CloudFunctions.createACollaborator,
        collaborator
      );
      Shield.remove('.collaborators');
      notification.success('Collaborator was created successfully');
      try {
        const collaborators =
          await this.collaboratorsVM.getRemoteCollaborators();
        this.collaboratorsVM.setCollaborators(collaborators);
      } catch (error) {
        Logger.error(this, this.createACollaborator.name, error);
      }
    } catch (error: any) {
      Logger.error(this, this.createACollaborator.name, error);
      Shield.remove('.collaborators');
      notification.error(
        `Network error or ${collaborator.collabEmail} is yet to sign up on Bookshelf Hub.`
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
