
import { DocumentData, FieldPath, QueryConstraint, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { IDocId } from 'src/data/models/idoc-id';

export interface IDatabase {
  getArrayOfDocData: <T>(path: string, pathSegment: string[]) => Promise<T[]>;

  updateDocData: (
    path: string,
    pathSegment: string[],
    object: any
  ) => Promise<void>;

  getQueryDocumentSnapshot: (
    path: string,
    pathSegment: string[]
  ) => Promise<QueryDocumentSnapshot<DocumentData> | null>;

  getArrayOfDocDataWhere: <T>(
    path: string,
    pathSegment: string[],
    queryConstraint: QueryConstraint[]
  ) => Promise<T[]>;

  updateAllDocData: <T>(
    path: string,
    pathSegment: string[],
    field: string | FieldPath,
    fieldValue: unknown,
    docIds: IDocId[]
  ) => Promise<void>;

  getLiveArrayOfDocData: <T>(
    path: string,
    pathSegment: string[],
    queryConstraint: QueryConstraint[],
    onNext: (type: T[], arrayOfDocIds: string[]) => void,
    onError: (errorCode: string) => void
  ) => void;

  deleteAllDocs: (
    path: string,
    pathSegment: string[],
    docIds: IDocId[]
  ) => Promise<void>;
  deleteDoc: (path: string, pathSegment: string[]) => Promise<void>;

  getLiveDocData: <T>(
    path: string,
    pathSegment: string[],
    onNext: (type: T) => void
  ) => void;
  getDocData: <T>(path: string, pathSegment: string[]) => Promise<T | null>;
  addDocData: (
    path: string,
    pathSegment: string[],
    type: any,
    merge?: { merge: boolean }
  ) => Promise<void>;
}