import { Inject, Injectable } from "@angular/core";
import { DocumentData, DocumentReference } from "@angular/fire/firestore";
import { UploadMetadata, UploadTaskSnapshot } from "@angular/fire/storage";
import { IBookInventory } from "src/data/models/entities/ibook-inventory";
import { IPublishedBook } from "src/data/models/entities/ipublished-books";
import { DATABASE_IJTOKEN } from "src/data/remote-data-source/database.token";
import { IDatabase } from "src/data/remote-data-source/idatabase";
import { ICloudStorage } from "src/services/storage/icloud-storage";
import { CLOUD_STORAGE_IJTOKEN } from "src/services/storage/icloud-storage-token";

@Injectable()
export class PublishYourBookViewModel {


  
  constructor(
    @Inject(CLOUD_STORAGE_IJTOKEN) private cloudStorage: ICloudStorage,
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase
  ) {}

  private getAvailableBookSerialNos(collection: string, pathSegment: string[]) {
    return this.remoteData.getDocData<IBookInventory>(collection, pathSegment);
  }

   getDocRef(collection: string, pathSegment: string[]) {
    return this.remoteData.getDocRef(collection, pathSegment);
  }

  uploadBookDataTransaction(
    sNDocRef: DocumentReference<DocumentData>,
    bookUploadDocRef: DocumentReference<DocumentData>,
    book: IPublishedBook
  ) {
    return this.remoteData.uploadBookDataTransaction(sNDocRef, bookUploadDocRef, book);
  }

  updatePaymentCurrency(collection: string, pathSegment: string[], field:string, fieldValue: any) {
    return this.remoteData.updateDocField(
      collection,
      pathSegment,
      field,
      fieldValue
    );
  }

  uploadBookFile(
    pathToFile: string,
    file: Blob | Uint8Array | ArrayBuffer,
    onProgress: (snapshot: UploadTaskSnapshot, progress: number) => void,
    onComplete: (downloadUrl: string) => void,
    onError: (error: any) => void,
    metaData?: UploadMetadata | undefined
  ) {
    this.cloudStorage.uploadBytesResumable(
      pathToFile,
      file,
      onProgress,
      onComplete,
      onError
    );
  }
}