import { UploadMetadata, UploadTaskSnapshot } from "@angular/fire/storage";

export interface ICloudStorage {
  uploadBytesResumable: (
    pathToFile: string,
    file: Blob | Uint8Array | ArrayBuffer,
    onProgress: (snapshot: UploadTaskSnapshot, progress: number) => void,
    onComplete: (downloadUrl: string) => void,
    onError: (error: any) => void,
    metaData?: UploadMetadata | undefined
  ) => void;
} 