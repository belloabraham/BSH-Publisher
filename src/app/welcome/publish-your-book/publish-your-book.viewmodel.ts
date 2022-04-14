import { Inject, Injectable } from "@angular/core";
import { UploadMetadata, UploadTaskSnapshot } from "@angular/fire/storage";
import { IBookInventory } from "src/data/models/entities/ibook-inventory";
import { Collection } from "src/data/remote-data-source/collection";
import { DATABASE_IJTOKEN } from "src/data/remote-data-source/database.token";
import { IDatabase } from "src/data/remote-data-source/idatabase";
import { ICloudStorage } from "src/services/storage/icloud-storage";
import { CLOUD_STORAGE_IJTOKEN } from "src/services/storage/icloud-storage-token";

@Injectable()
export class PublishYourBookViewModel {
  constructor(
    @Inject(CLOUD_STORAGE_IJTOKEN) private cloudStorage: ICloudStorage,
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase
    ) { }
    

    getAvailableBookSerialNo(collection:string, pathSegment:string[]) {
         return this.remoteData.getDocData<IBookInventory>(
           collection,
           pathSegment
         );
    }

    uploadBookData(collection:string, pathSegment:string[], type:any) {
       return  this.remoteData.addDocData(
           collection,
           pathSegment,
           type
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