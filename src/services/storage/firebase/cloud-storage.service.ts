import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
  UploadMetadata,
  UploadTaskSnapshot,
} from '@angular/fire/storage';
import { ICloudStorage } from '../icloud-storage';

@Injectable()
export class CloudStorageService implements ICloudStorage {
  constructor(private storage: Storage) {}

  uploadBytesResumable(
    pathToFile: string,
    file: Blob | Uint8Array | ArrayBuffer,
    onProgress: (snapshot: UploadTaskSnapshot, progress: number) => void,
    onComplete: (downloadUrl: string) => void,
    onError: (error: any) => void,
    metaData?:UploadMetadata | undefined
  ) {
    const storageRef = ref(this.storage, pathToFile);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(snapshot, progress);
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        onError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onComplete(downloadURL);
        });
      }
    );
  }
}
