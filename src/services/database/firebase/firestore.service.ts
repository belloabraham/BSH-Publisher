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
} from '@angular/fire/firestore';
import { Logger } from 'src/helpers/utils/logger';
import { IDatabase } from '../idatabase';
import { ErrorCodes } from './ErrorCodes';

@Injectable()
export class FirestoreService implements IDatabase {
  constructor(private firestore: Firestore) {}

   addDocData<T>(
    path: string,
    pathSegment: string[],
    type: T,
    merge = { merge: true }
  ):Promise<void> {
    let docRef = doc(this.firestore, path, ...pathSegment);
    return  setDoc(docRef, type, merge);
  }

  deleteDoc(path: string, pathSegment: string[]):Promise<void> {
    let docRef = doc(this.firestore, path, ...pathSegment);
    return deleteDoc(docRef);
  }

  getArrayOfDocData<T>(path: string, queryConstraint: QueryConstraint[]): Promise <T[]> {
    let q = query(collection(this.firestore, path), ...queryConstraint);
    return  getDocs(q).then((querySnapshot) => {
      let dataArray: T[] = [];
      querySnapshot.forEach((queryDoc) => {
        if (queryDoc.exists()) {
          let data = queryDoc.data();
          let json = JSON.stringify(data);
          let type: T = JSON.parse(json);
          dataArray.push(type);
        }
      });
      return dataArray;
    });
  }

  getLiveArrayOfDocData<T>(
    path: string,
    queryConstraint: QueryConstraint[],
    onNext: (type: T[]) => void,
    onError: (errorCode: string) => void
  ) {
    let q = query(collection(this.firestore, path), ...queryConstraint);
    let dataArray: T[] = [];
    onSnapshot(q, {
      next: (querySnapShot) => {
        querySnapShot.forEach((queryDoc) => {
          if (queryDoc.exists()) {
            let data = queryDoc.data();
            let json = JSON.stringify(data);
            let type: T = JSON.parse(json);
            dataArray.push(type);
          }
        });
        onNext(dataArray);
      },
      error: (error: FirestoreError) => {
        Logger.error('FirestoreService', 'getLiveArrayOfData', error);
        let code = error.code.toString();
        onError(code);
        if (code !== ErrorCodes.permDenied && code !== ErrorCodes.unauth) {
          setTimeout(() => {
            this.getLiveArrayOfDocData(path, queryConstraint, onNext, onError);
          }, 2000);
        }
      },
    });
  }

  getDocData<T>(path: string, pathSegment: string[]): Promise<T | null> {
    let docRef = doc(this.firestore, path, ...pathSegment);
    return getDoc(docRef).then((docSnapShot) => {
      if (docSnapShot.exists()) {
        let data = docSnapShot.data();
        let json = JSON.stringify(data);
        let type: T = JSON.parse(json);
        return type;
      } else {
        return null;
      }
    });
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
