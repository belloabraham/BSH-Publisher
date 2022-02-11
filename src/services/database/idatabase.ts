
import { QueryConstraint } from '@angular/fire/firestore';


export interface IDatabase {
  
  getArrayOfDocData: <T>(
    path: string,
    queryConstraint: QueryConstraint[]
  ) => Promise<T[]>;

  getLiveArrayOfDocData: <T>(
    path: string,
    queryConstraint: QueryConstraint[],
    onNext: (type: T[]) => void,
    onError: (errorCode: string) => void
  ) => void;

  deleteDoc: (path: string, pathSegment: string[]) => Promise<void>;

  getLiveDocData: <T>(
    path: string,
    pathSegment: string[],
    onNext: (type: T) => void
  ) => void;
  getDocData: <T>(path: string, pathSegment: string[]) => Promise<T | null>;
  addDocData: <T>(
    path: string,
    pathSegment: string[],
    type: T,
    merge?: { merge: boolean }
  ) => Promise<void>;
}
