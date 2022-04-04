import { Injectable } from '@angular/core';
import {
  doc,
  getDoc,
  setDoc,
  Firestore,
  FirestoreError,
  deleteDoc,
  onSnapshot,
  collection,
  QueryConstraint,
  query,
  getDocs,
  writeBatch,
  FieldPath,
  DocumentData,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { IDocId } from 'src/domain/models/idoc-id';
import { Logger } from 'src/helpers/utils/logger';
import { IDatabase } from '../idatabase';
import { ErrorCodes } from './ErrorCodes';

@Injectable()
export class FirestoreService implements IDatabase {
  constructor(private firestore: Firestore) {}

  addDocData(
    path: string,
    pathSegment: string[],
    type: any,
    merge = { merge: true }
  ): Promise<void> {
    const docRef = doc(this.firestore, path, ...pathSegment);
    return setDoc(docRef, type, merge);
  }

  deleteAllDocs(path: string, pathSegment: string[], docIds: IDocId[]) {
    const batch = writeBatch(this.firestore);
    for (let index = 0; index < docIds.length; index++) {
      const pathSegmentWithId = pathSegment.concat(docIds[index].docId!);
      const docRef = doc(this.firestore, path, ...pathSegmentWithId);
      batch.delete(docRef);
    }
    return batch.commit();
  }

  updateDocData(
    path: string,
    pathSegment: string[],
    object: any
  ):Promise<void> {
    const docRef = doc(this.firestore, path, ...pathSegment);
    return updateDoc(docRef, object);
  }

  updateAllDocData<T>(
    path: string,
    pathSegment: string[],
    field: string | FieldPath,
    fieldValue: unknown,
    docIds: IDocId[]
  ) {
    const batch = writeBatch(this.firestore);
    for (let index = 0; index < docIds.length; index++) {
      const pathSegmentWithId = pathSegment.concat(docIds[index].docId!);
      const docRef = doc(this.firestore, path, ...pathSegmentWithId);
      batch.update(docRef, field, fieldValue);
    }
    return batch.commit();
  }

  deleteDoc(path: string, pathSegment: string[]): Promise<void> {
    const docRef = doc(this.firestore, path, ...pathSegment);
    return deleteDoc(docRef);
  }

  async getArrayOfDocDataWhere<T>(
    path: string,
    pathSegment: string[],
    queryConstraint: QueryConstraint[]
  ): Promise<T[]> {
    const q = query(
      collection(this.firestore, path, ...pathSegment),
      ...queryConstraint
    );
    const querySnapshot = await getDocs(q);
    const dataArray: T[] = [];
    querySnapshot.forEach((queryDoc) => {
      if (queryDoc.exists()) {
        const data = queryDoc.data();
        const json = JSON.stringify(data);
        const type: T = JSON.parse(json);
        dataArray.concat(type);
      }
    });
    return dataArray;
  }

  async getArrayOfDocData<T>(
    path: string,
    pathSegment: string[]
  ): Promise<T[]> {
    const q = query(collection(this.firestore, path, ...pathSegment),
    );
    const querySnapshot = await getDocs(q);
    const dataArray: T[] = [];
    querySnapshot.forEach((queryDoc) => {
      if (queryDoc.exists()) {
        const data = queryDoc.data();
        const json = JSON.stringify(data);
        const type: T = JSON.parse(json);
        dataArray.concat(type);
      }
    });
    return dataArray;
  }

  getLiveArrayOfDocData<T>(
    path: string,
    pathSegment: string[],
    queryConstraint: QueryConstraint[],
    onNext: (type: T[], arrayOfDocIds: string[]) => void,
    onError: (errorCode: string) => void
  ) {
    const q = query(
      collection(this.firestore, path, ...pathSegment),
      ...queryConstraint
    );
    const dataArray: T[] = [];
    const arrayOfIds: string[] = [];
    onSnapshot(q, {
      next: (querySnapShot) => {
        querySnapShot.forEach((queryDoc) => {
          if (queryDoc.exists()) {
            const data = queryDoc.data();
            const json = JSON.stringify(data);
            const type: T = JSON.parse(json);
            dataArray.push(type);
            arrayOfIds.push(queryDoc.id);
          }
        });

        onNext(dataArray, arrayOfIds);
      },
      error: (error: FirestoreError) => {
        const code = error.code.toString();
        onError(code);
        if (code !== ErrorCodes.permDenied && code !== ErrorCodes.unauth) {
          setTimeout(() => {
            this.getLiveArrayOfDocData(
              path,
              pathSegment,
              queryConstraint,
              onNext,
              onError
            );
          }, 2000);
        }
      },
    });
  }

  async getQueryDocumentSnapshot(
    path: string,
    pathSegment: string[]
  ): Promise<QueryDocumentSnapshot<DocumentData> | null> {
    const docRef = doc(this.firestore, path, ...pathSegment);
    const docSnapShot = await getDoc(docRef);
    if (docSnapShot.exists()) {
      return docSnapShot;
    } else {
      return null;
    }
  }

  async getDocData<T>(path: string, pathSegment: string[]): Promise<T | null> {
    const docRef = doc(this.firestore, path, ...pathSegment);
    const docSnapShot = await getDoc(docRef);
    if (docSnapShot.exists()) {
      const data = docSnapShot.data();
      const json = JSON.stringify(data);
      const type: T = JSON.parse(json);
      return type;
    } else {
      return null;
    }
  }

  getLiveDocData<T>(
    path: string,
    pathSegment: string[],
    onNext: (type: T) => void
  ) {
    const ref = doc(this.firestore, path, ...pathSegment);
    onSnapshot(ref, {
      next: (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const json = JSON.stringify(data);
          const type: T = JSON.parse(json);
          onNext(type);
        }
      },
      error: (error: FirestoreError) => {
        Logger.error('FirestoreService', 'getLiveData', error);
        const code = error.code.toString();
        if (code !== ErrorCodes.permDenied && code !== ErrorCodes.unauth) {
          setTimeout(() => {
            this.getLiveDocData(path, pathSegment, onNext);
          }, 2000);
        }
      },
    });
  }
}
