
import { DocumentData, DocumentReference, FieldPath, QueryConstraint, QueryDocumentSnapshot, QuerySnapshot, Unsubscribe } from '@angular/fire/firestore';
import { IDocId } from 'src/data/models/idoc-id';
import { IPublishedBook } from '../models/entities/ipublished-books';

export interface IDatabase {
  getArrayOfDocData: <T>(path: string, pathSegment: string[]) => Promise<T[]>;

  uploadBookDataTransaction: (
    sNDocRef: DocumentReference<DocumentData>,
    bookUploadDocRef: DocumentReference<DocumentData>,
    book: IPublishedBook
  ) => Promise<void>;

  getDocRef: (
    path: string,
    pathSegment: string[]
  ) => DocumentReference<DocumentData>;

  updateDocData: (
    path: string,
    pathSegment: string[],
    object: any
  ) => Promise<void>;

  updateDocField: (
    path: string,
    pathSegment: string[],
    field: string | FieldPath,
    fieldValue: unknown
  ) => Promise<void>;

  getQueryDocumentSnapshot: (
    path: string,
    pathSegment: string[]
  ) => Promise<QueryDocumentSnapshot<DocumentData> | null>;

  getQuerySnapshotWhereWithQueryGroup: (
    collection: string,
    queryConstraint: QueryConstraint[]
  ) => Promise<QuerySnapshot<DocumentData>>;

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
  ) => Unsubscribe;

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
  ) => Unsubscribe;
  getDocData: <T>(path: string, pathSegment: string[]) => Promise<T | null>;
  addDocData: (
    path: string,
    pathSegment: string[],
    type: any,
    merge?: { merge: boolean }
  ) => Promise<void>;
}
