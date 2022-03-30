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
    let docRef = doc(this.firestore, path, ...pathSegment);
    return setDoc(docRef, type, merge);
  }

  deleteAllDocs(path: string, pathSegment: string[], docIds: IDocId[]) {
    let batch = writeBatch(this.firestore);
    for (let index = 0; index < docIds.length; index++) {
      const pathSegmentWithId = pathSegment.concat(docIds[index].docId!);
      const docRef = doc(this.firestore, path, ...pathSegmentWithId);
      batch.delete(docRef);
    }
    return batch.commit();
  }

  updateAllDocData<T>(
    path: string,
    pathSegment: string[],
    field: string | FieldPath,
    fieldValue:unknown,
    docIds: IDocId[]
  ) {
    let batch = writeBatch(this.firestore);
     for (let index = 0; index < docIds.length; index++) {
       const pathSegmentWithId = pathSegment.concat(docIds[index].docId!);
      let docRef = doc(this.firestore, path, ...pathSegmentWithId);
      batch.update(docRef, field, fieldValue);
     }
    return batch.commit();
  }

  deleteDoc(path: string, pathSegment: string[]): Promise<void> {
    let docRef = doc(this.firestore, path, ...pathSegment);
    return deleteDoc(docRef);
  }

  async getArrayOfDocData<T>(
    path: string,
    queryConstraint: QueryConstraint[]
  ): Promise<T[]> {
    let q = query(collection(this.firestore, path), ...queryConstraint);
    const querySnapshot = await getDocs(q);
    let dataArray: T[] = [];
    querySnapshot.forEach((queryDoc) => {
      if (queryDoc.exists()) {
        let data = queryDoc.data();
        let json = JSON.stringify(data);
        let type: T = JSON.parse(json);
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
    let q = query(
      collection(this.firestore, path, ...pathSegment),
      ...queryConstraint
    );
    let dataArray: T[] = [];
    let arrayOfIds: string[] = [];
    onSnapshot(q, {
      next: (querySnapShot) => {
        querySnapShot.forEach((queryDoc) => {
          if (queryDoc.exists()) {
            let data = queryDoc.data();
            let json = JSON.stringify(data);
            let type: T = JSON.parse(json);
            dataArray.push(type);
            arrayOfIds.push(queryDoc.id);
          }
        });

        onNext(dataArray, arrayOfIds);
      },
      error: (error: FirestoreError) => {
        let code = error.code.toString();
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

  async getDocData<T>(path: string, pathSegment: string[]): Promise<T | null> {
    let docRef = doc(this.firestore, path, ...pathSegment);
    const docSnapShot = await getDoc(docRef);
    if (docSnapShot.exists()) {
      let data = docSnapShot.data();
      let json = JSON.stringify(data);
      let type: T = JSON.parse(json);
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
    let ref = doc(this.firestore, path, ...pathSegment);
    onSnapshot(ref, {
      next: (docSnapshot) => {
        if (docSnapshot.exists()) {
          let data = docSnapshot.data();
          let json = JSON.stringify(data);
          let type: T = JSON.parse(json);
          onNext(type);
        }
      },
      error: (error: FirestoreError) => {
        Logger.error('FirestoreService', 'getLiveData', error);
        let code = error.code.toString();
        if (code !== ErrorCodes.permDenied && code !== ErrorCodes.unauth) {
          setTimeout(() => {
            this.getLiveDocData(path, pathSegment, onNext);
          }, 2000);
        }
      },
    });
  }
}
