import { UploadTaskSnapshot } from "@angular/fire/storage";

export interface ICloudStorage {
  uploadBytesResumable: <T>(
    pathToFile: string,
    file: Blob | Uint8Array | ArrayBuffer,
    onProgress: (snapshot: UploadTaskSnapshot, progress: number) => void,
    onComplete: (downloadUrl: string) => void,
    onError: (error: any) => void
  ) => void;
} 